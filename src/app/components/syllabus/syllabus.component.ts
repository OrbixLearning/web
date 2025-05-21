import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { Syllabus } from '../../models/Syllabus';

@Component({
	selector: 'o-syllabus',
	imports: [TreeModule],
	templateUrl: './syllabus.component.html',
	styleUrl: './syllabus.component.scss',
})
export class SyllabusComponent {
	@Input() syllabus?: Syllabus[];
	@Input() mode: 'readonly' | 'checkbox' | 'selection' | 'click' = 'readonly';
	@Output() syllabusClicked: EventEmitter<Syllabus> = new EventEmitter<Syllabus>();
	@Output() syllabusMarked: EventEmitter<Syllabus[]> = new EventEmitter<Syllabus[]>();

	syllabusComponentTree: TreeNode[] = this.buildSyllabusTree();
	selection?: any;

	ngOnChanges() {
		this.syllabusComponentTree = this.buildSyllabusTree();
	}

	get selectionMode(): 'single' | 'multiple' | 'checkbox' | null | undefined {
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

	recursiveSyllabusTreeBuildCall(syllabus: Syllabus[], depth: number): TreeNode[] {
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
