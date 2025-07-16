import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { Syllabus } from '../../models/Syllabus';
import { SyllabusPreset } from '../../models/Classroom';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'o-syllabus',
	imports: [TreeModule, ButtonModule],
	templateUrl: './syllabus.component.html',
	styleUrl: './syllabus.component.scss',
})
export class SyllabusComponent {
	@Input() syllabus?: Syllabus[];
	@Input() preMarkedSyllabus?: Syllabus[];
	@Input() mode: 'view' | 'filter' | 'edit' | 'select' = 'view';
	@Input() presets?: SyllabusPreset[];
	@Output() syllabusClicked: EventEmitter<Syllabus> = new EventEmitter<Syllabus>();
	@Output() syllabusMarked: EventEmitter<Syllabus[]> = new EventEmitter<Syllabus[]>();

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
			}));
		}
	}

	ngOnChanges() {
		this.syllabusComponentTree = this.buildSyllabusTree();
	}

	get selectionMode(): 'single' | 'multiple' | 'checkbox' | undefined {
		if (this.mode === 'view') {
			return undefined;
		}
		return 'checkbox';
	}

	buildSyllabusTree(): TreeNode[] {
		if (!this.syllabus) return [];
		return this.recursiveSyllabusTreeBuildCall(this.syllabus, 0);
	}

	recursiveSyllabusTreeBuildCall(syllabus: Syllabus[] | null, depth: number, preset?: string[]): TreeNode[] {
		if (!syllabus) return [];
		return syllabus.map(s => {
			return {
				key: s.id!,
				label: s.name,
				data: s,
				leaf: s.topics ? s.topics.length === 0 : true,
				selectable: true,
				expanded: depth < 2,
				children: this.recursiveSyllabusTreeBuildCall(s.topics, depth + 1),
			};
		});
	}

	loadPreset(preset: SyllabusPreset) {
		this.selection = [];
		this.addNodestoSelectionRecursively(preset.syllabusIds, this.syllabus || []);
		this.selectionChange(this.selection);
	}

	addNodestoSelectionRecursively(ids: string[], syllabus: Syllabus[]) {
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
					},
				];
			}
			if (s.topics && s.topics.length > 0) {
				this.addNodestoSelectionRecursively(ids, s.topics);
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

	topicSelected(syllabus: Syllabus) {
		this.syllabusClicked.emit(syllabus);
	}

	topicClicked(syllabus: Syllabus) {
		setTimeout(() => {
			this.selection = undefined;
		});
		this.syllabusClicked.emit(syllabus);
	}
}
