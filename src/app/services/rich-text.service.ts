import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class RichTextService {
	api: string = `${environment.API_URL}/rich-text`;
	http: HttpClient = inject(HttpClient);

	uploadRichTextImage(image: File): Observable<{ imagePath: string }> {
		const formData = new FormData();
		formData.append('image', image);
		return this.http.post<{ imagePath: string }>(`${this.api}/image`, formData);
	}
}
