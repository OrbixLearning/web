import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { SyllabusPreset } from '../../models/Classroom';
import { Syllabus } from '../../models/Syllabus';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';

@Component({
	selector: 'o-syllabus',
	imports: [TreeModule, ButtonModule, MatButtonModule, MatIconModule, TextButtonComponent],
	templateUrl: './syllabus.component.html',
	styleUrl: './syllabus.component.scss',
})
export class SyllabusComponent {
	@Input() syllabus?: Syllabus[];
	@Input() preMarkedSyllabus?: Syllabus[];
	@Input() mode: 'view' | 'filter' | 'edit' | 'select' = 'view';
	@Input() presets?: SyllabusPreset[];
	@Output() syllabusMarked: EventEmitter<Syllabus[]> = new EventEmitter<Syllabus[]>();
	@Output() editSyllabus: EventEmitter<Syllabus> = new EventEmitter<Syllabus>();
	@Output() deleteSyllabus: EventEmitter<Syllabus> = new EventEmitter<Syllabus>();

	readonly TREE_INITIAL_EXPAND_DEPTH = 0;

	syllabusComponentTree: TreeNode[] = this.buildSyllabusTree();
	selection?: TreeNode[];

	ngOnInit() {
		if (this.preMarkedSyllabus) {
			this.selection = this.preMarkedSyllabus.map(s => ({
				key: s.id!,
				label: s.name,
				data: s,
				checked: true,
				selectable: true,
				type: this.mode,
			}));
		}
	}

	ngOnChanges() {
		this.syllabusComponentTree = this.buildSyllabusTree();
	}

	get selectionMode(): 'single' | 'multiple' | 'checkbox' | undefined {
		if (this.mode === 'view' || this.mode === 'edit') {
			return undefined;
		}
		return 'checkbox';
	}

	buildSyllabusTree(): TreeNode[] {
		if (!this.syllabus) return [];
		return this.recursiveSyllabusTreeBuildCall(this.syllabus, 0);
	}

	recursiveSyllabusTreeBuildCall(syllabus: Syllabus[] | null, depth: number): TreeNode[] {
		if (!syllabus) return [];
		return syllabus.map(s => {
			return {
				key: s.id!,
				label: s.name,
				data: s,
				leaf: s.topics ? s.topics.length === 0 : true,
				selectable: true,
				type: this.mode,
				expanded: depth < this.TREE_INITIAL_EXPAND_DEPTH,
				children: this.recursiveSyllabusTreeBuildCall(s.topics, depth + 1),
			};
		});
	}

	loadPreset(preset: SyllabusPreset) {
		this.selection = [];
		this.addNodesToSelectionRecursively(preset.syllabusIds, this.syllabus || []);
		this.selectionChange(this.selection);
	}

	addNodesToSelectionRecursively(ids: string[], syllabus: Syllabus[]) {
		syllabus.forEach(s => {
			if (ids.includes(s.id!)) {
				this.selection = [
					...(this.selection || []),
					{
						key: s.id!,
						label: s.name,
						data: s,
						checked: true,
						selectable: true,
						type: this.mode,
					},
				];
			}
			if (s.topics && s.topics.length > 0) {
				this.addNodesToSelectionRecursively(ids, s.topics);
			}
		});
	}

	clearSelection() {
		this.selection = [];
		this.selectionChange(this.selection);
	}

	selectionChange(node: any) {
		if (this.mode !== 'view') {
			let nodeTree = node as TreeNode[];
			let syllabus: Syllabus[] = nodeTree.map(n => n.data as Syllabus);
			this.topicMarked(syllabus);
		}
	}

	topicMarked(syllabus: Syllabus[]) {
		this.syllabusMarked.emit(syllabus);
	}
}
