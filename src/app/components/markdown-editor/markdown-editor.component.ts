import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMarkdownEditorModule, EditorLocale, EditorOption } from 'angular-markdown-editor';

@Component({
	selector: 'o-markdown-editor',
	imports: [AngularMarkdownEditorModule, FormsModule],
	templateUrl: './markdown-editor.component.html',
	styleUrl: './markdown-editor.component.scss',
})
export class MarkdownEditorComponent {
	@Input() startingText: string = '';
	@Input() id: string = 'markdownEditor';
	@Input() rows: number = 12;
	@Output() textChange = new EventEmitter<string>();

	customLocale: EditorLocale = {
		language: 'pt',
		dictionary: {
			'Bold': 'Negrito',
			'strong text': 'Texto em Negrito',
			'Italic': 'Itálico',
			'emphasized text': 'Texto em Itálico',
			'Heading': 'Título',
			'heading text': 'Título',
			'Strikethrough': 'Tachado',
			'strikethrough': 'Texto Tachado',
			'URL/Link': 'Link',
			'enter link description here': 'Digite a descrição do link aqui',
			'Image': 'Imagem',
			'enter image description here': 'Digite a descrição da imagem aqui',
			'enter image title here': 'Digite o título da imagem aqui',
			'List': 'Lista',
			'list text here': 'Texto da lista aqui',
			'Unordered List': 'Lista',
			'Ordered List': 'Lista Numerada',
			'Code': 'Código',
			'code text here': 'Código aqui',
			'Quote': 'Citação',
			'quote here': 'Citação aqui',
			'Preview': 'Visualizar',
			'Table': 'Tabela',
			'Insert Hyperlink': 'Inserir Link',
			'Insert Image Hyperlink': 'Inserir Link de Imagem',
			'Tables': 'Tabelas',
			'Are': 'São',
			'Cool': 'Legais',
			'col 3 is': 'célula 11',
			'right-aligned': 'célula 12',
			'$1600': 'célula 13',
			'col 2 is': 'célula 21',
			'centered': 'célula 22',
			'$12': 'célula 23',
			'zebra stripes': 'célula 31',
			'are neat': 'célula 32',
			'$1': 'célula 33',
		},
	};

	readonly EDITOR_OPTIONS: EditorOption = {
		autofocus: true,
		initialstate: 'editor',
		language: 'pt',
		fullscreen: {
			enable: false,
			icons: {},
		},
	};
}
