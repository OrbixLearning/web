import { Component, inject, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ContextService } from '../../../services/context.service';
import { Syllabus } from '../../../models/Syllabus';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-syllabus-home',
  standalone: true,
  imports: [MatIconModule, RouterModule, FormsModule, MatButtonModule],
  templateUrl: './syllabus-home.component.html',
  styleUrls: ['./syllabus-home.component.scss']
})
export class SyllabusHomeComponent implements OnInit {
  ctx: ContextService = inject(ContextService);

  syllabus: Syllabus[] = [];
  expandedTopics: { [key: string]: boolean } = {};
  searchTerm: string = '';

  ngOnInit(): void {
    this.syllabus = this.ctx.classroom?.syllabus ?? [];
  }

  get classroomHomeUrl(): string[] {
    return ['/i', this.ctx.institution!.id!, 'c', this.ctx.classroom!.id!];
  }

  get filteredSyllabus(): Syllabus[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.syllabus;
    }
    const result: Syllabus[] = [];
    for (const topic of this.syllabus) {
      const topicNameMatches = topic.name.toLowerCase().includes(term);
      const matchingSubTopics = topic.topics?.filter(subTopic =>
        subTopic.name.toLowerCase().includes(term)
      ) ?? [];
      if (topicNameMatches || matchingSubTopics.length > 0) {
        if (topicNameMatches) {
          result.push(topic);
        } else {
          result.push({
            ...topic,
            topics: matchingSubTopics,
          });
        }
      }
    }
    return result;
  }

  toggleExpand(topicId: string | null): void {
    if (topicId) {
      this.expandedTopics[topicId] = !this.expandedTopics[topicId];
    }
  }

  isExpanded(topicId: string | null): boolean {
    if (this.searchTerm.trim().length > 0) {
      return true;
    }
    return topicId ? !!this.expandedTopics[topicId] : false;
  }
}