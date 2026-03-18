import { Component, Input } from '@angular/core';
import { HeadingComponent, KatexComponent, MermaidComponent, PrismComponent, RemarkModule } from 'ngx-remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

/**
 * Component for rendering native Markdown in Angular.
 * * Uses the ngx-remark library to convert Markdown into an AST and render
 * it using Angular templates, supporting Prism (code), KaTeX (math), and Mermaid (diagrams).
 * * Required external configurations:
 * 1. index.html (via CDN):
 * - PrismJS, KaTeX, and Mermaid scripts and styles.
 * 2. main.ts:
 * - Global KaTeX declaration on the window object.
 * 3. NPM:
 * - remark-math, remark-parse, and unified packages for the AST processor.
 * * Reference: https://github.com/ericleib/ngx-remark
 */

@Component({
	selector: 'o-markdown',
	imports: [RemarkModule, KatexComponent, MermaidComponent, PrismComponent, HeadingComponent, KatexComponent],
	templateUrl: './markdown.component.html',
	styleUrl: './markdown.component.scss',
})
export class MarkdownComponent {
	@Input() text: string = '';

	processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);
}
