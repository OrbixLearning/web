import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { Syllabus } from '../../models/Syllabus';
import { ContextService } from '../../services/context.service';

@Component({
	selector: 'o-syllabus',
	imports: [TreeModule],
	templateUrl: './syllabus.component.html',
	styleUrl: './syllabus.component.scss',
})
export class SyllabusComponent {
	ctx: ContextService = inject(ContextService);

	@Input() mode: 'readonly' | 'checkbox' | 'selection' | 'click' = 'readonly';
	@Output() syllabusClicked: EventEmitter<Syllabus> = new EventEmitter<Syllabus>();

	syllabusComponentTree: TreeNode[] = this.buildSyllabusTree();
	selection?: any;

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
		let syllabus: Syllabus[] = this.ctx.classroom?.syllabus!;
		if (!syllabus) return [];
		return this.recursiveSyllabusTreeBuildCall(syllabus, 0);
	}

	recursiveSyllabusTreeBuildCall(syllabus: Syllabus[], depth: number): TreeNode[] {
		return syllabus.map(s => {
			return {
				key: s.id,
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
				this.topicClicked(node.data);
				break;
			case 'selection':
				this.topicSelected(node.data);
				break;
			case 'click':
				this.topicClicked(node.data);
				break;
		}
	}

	topicMarked(syllabus: Syllabus) {
		this.syllabusClicked.emit(syllabus);
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
