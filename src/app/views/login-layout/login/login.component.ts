import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'o-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    LoadingComponent,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  service: AuthService = inject(AuthService);
  router: Router = inject(Router);
  formBuilder: FormBuilder = inject(FormBuilder);
  route: ActivatedRoute = inject(ActivatedRoute);

  isLoading: boolean = false;
  error: string = '';
  form = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  hidePassword: boolean = true;

  getFormControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  async onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      await lastValueFrom(
        this.service.login(
          this.getFormControl('email').value,
          this.getFormControl('password').value
        )
      )
        .then(() => {
          this.router.navigate(['/']);
        })
        .catch((err) => {
          this.error = err.error;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    await this.service
      .getGoogleOAuthURL()
      .then((url: string) => {
        window.location.href = url;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
