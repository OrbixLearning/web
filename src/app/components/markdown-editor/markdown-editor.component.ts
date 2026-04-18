import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMarkdownEditorModule, EditorLocale, EditorOption } from 'angular-markdown-editor';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { RichTextService } from '../../services/rich-text.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'o-markdown-editor',
	imports: [AngularMarkdownEditorModule, FormsModule, LoadingComponent],
	templateUrl: './markdown-editor.component.html',
	styleUrl: './markdown-editor.component.scss',
})
export class MarkdownEditorComponent {
	service: RichTextService = inject(RichTextService);

	@Input() startingText: string = '';
	@Input() editorId: string = 'markdownEditor';
	@Input() rows: number = 2;
	@Input() height: string = '70vh';
	@Input() resize: 'vertical' | 'horizontal' | 'both' | 'none' = 'none';
	@Output() textChange = new EventEmitter<string>();

	isLoading: boolean = false;

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

	EDITOR_OPTIONS: EditorOption = {
		autofocus: true,
		initialstate: 'editor',
		language: 'pt',
		fullscreen: {
			enable: false,
			icons: {},
		},
		resize: this.resize,
		onShow: (e: any) => {
			this.addTabSupport(e);
			this.handleImageInput(e);
		},
	};

	get imageInputId(): string {
		return `imageInput-${this.editorId}`;
	}

	ngOnInit() {
		this.EDITOR_OPTIONS.resize = this.resize;
	}

	addTabSupport(e: any) {
		const textarea = e.$editor.find('textarea')[0];
		textarea.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				event.preventDefault();
				const selected = e.getSelection();
				const tabCharacter = '\t';
				const newPos = textarea.selectionStart + tabCharacter.length;
				e.replaceSelection(tabCharacter);
				e.setSelection(selected.start + tabCharacter.length, selected.start + tabCharacter.length);
				setTimeout(() => {
					textarea.selectionStart = textarea.selectionEnd = newPos;
				}, 150);
			}
		});
	}

	handleImageInput(e: any) {
		const defaultImageHandler = '[data-handler="bootstrap-markdown-cmdImage"]';
		const btnImage = e.$editor.find(defaultImageHandler);
		const textarea = e.$editor.find('textarea')[0];
		if (btnImage.length > 0) {
			btnImage.off('click');
			btnImage.on('click', (event: Event) => {
				event.preventDefault();
				event.stopPropagation();

				this.isLoading = true;
				this.uploadRichTextImage()
					.then((response: { imageUrl: string; imageName: string } | undefined) => {
						if (response) {
							const markdownImage = `![${response.imageName}](${response.imageUrl})`;
							const scrollTop = textarea.scrollTop;
							const cursorPos = textarea.selectionStart;

							const value = textarea.value;
							textarea.value = value.slice(0, cursorPos) + markdownImage + value.slice(cursorPos);

							textarea.selectionStart = textarea.selectionEnd = cursorPos + markdownImage.length;
							textarea.scrollTop = scrollTop;

							this.textChange.emit(textarea.value);
						}
					})
					.finally(() => {
						e.$element.focus();
						this.isLoading = false;
					});
			});
		}
	}

	async uploadRichTextImage(): Promise<{ imageUrl: string; imageName: string } | undefined> {
		return new Promise(resolve => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = 'image/*';

			input.onchange = async (event: Event) => {
				const target = event.target as HTMLInputElement;
				if (target.files && target.files.length > 0) {
					let file = target.files[0];
					if (file) {
						let imagePath = (await lastValueFrom(this.service.uploadRichTextImage(file))).imagePath;
						const urlResponse = `${environment.API_URL}/${imagePath}`;
						resolve({ imageUrl: urlResponse, imageName: file.name });
						return;
					}
				}
				resolve(undefined);
			};

			input.addEventListener('cancel', () => {
				resolve(undefined);
			});

			input.click();
		});
	}
}
