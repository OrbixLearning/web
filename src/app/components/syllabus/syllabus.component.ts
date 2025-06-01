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
	@Input() mode: 'readonly' | 'checkbox' | 'selection' | 'click' = 'readonly';
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
		switch (this.mode) {
			case 'checkbox':
				return 'checkbox';
			case 'selection':
				return 'multiple';
			case 'click':
				return 'single';
			default:
				return undefined;
		}
	}

	buildSyllabusTree(): TreeNode[] {
		if (!this.syllabus) return [];
		return this.recursiveSyllabusTreeBuildCall(this.syllabus, 0);
	}

	recursiveSyllabusTreeBuildCall(syllabus: Syllabus[], depth: number, preset?: string[]): TreeNode[] {
		return syllabus.map(s => {
			return {
				key: s.id!,
				label: s.name,
				data: s,
				leaf: s.topics.length === 0,
				parent: parent,
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
			if (s.topics.length > 0) {
				this.addNodestoSelectionRecursively(ids, s.topics);
			}
		});
	}

	clearSelection() {
		this.selection = [];
		this.selectionChange(this.selection);
	}

	selectionChange(node: any) {
		switch (this.mode) {
			case 'checkbox':
				let nodeTree = node as TreeNode[];
				let syllabus: Syllabus[] = nodeTree.map(n => n.data as Syllabus);
				this.topicMarked(syllabus);
				break;
			case 'selection':
				this.topicSelected(node.data);
				break;
			case 'click':
				this.topicClicked(node.data);
				break;
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
