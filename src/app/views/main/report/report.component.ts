import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { ReportTypeEnum } from '../../../enums/ReportType.enum';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../models/Report';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { MatCardModule } from '@angular/material/card';
import { DateUtils } from '../../../utils/Date.util';
import { HighlightButtonComponent } from "../../../components/buttons/highlight-button/highlight-button.component";

@Component({
	selector: 'o-report',
	imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent,
    MatCardModule,
    HighlightButtonComponent
],
	templateUrl: './report.component.html',
	styleUrl: './report.component.scss',
})
export class ReportComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: ReportService = inject(ReportService);

	isLoading: boolean = false;
	reportTypeEnum: typeof ReportTypeEnum = ReportTypeEnum;
	form = this.formBuilder.group({
		title: ['', Validators.required],
		description: ['', Validators.required],
		type: [ReportTypeEnum.SUGGESTION, Validators.required],
	});
	userReports: Report[] = [];

	get reportTypes(): ReportTypeEnum[] {
		return Object.values(ReportTypeEnum);
	}

	ngOnInit() {
		this.getData();
	}

	formatDate(date: Date) {
		return DateUtils.format(date, 'DD/MM/YYYY HH:mm');
	}

	async getData() {
		this.isLoading = true;
		await lastValueFrom(this.service.getUserReports())
			.then(res => {
				this.userReports = res;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.create(this.form.value.title!, this.form.value.description!, this.form.value.type!),
			)
				.then(res => {
					this.userReports.unshift(res);
					this.form.reset();
					this.form.markAsUntouched();
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
