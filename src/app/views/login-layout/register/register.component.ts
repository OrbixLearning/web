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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'o-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  service: AuthService = inject(AuthService);
  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);

  form = this.formBuilder.group({
    firstName: ['', Validators.required],
    surName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    passwordConfirmation: ['', Validators.required],
  });
  isLoading: boolean = false;
  error: string = '';
  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;

  getFormControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  verifyPasswords(): boolean {
    const password = this.getFormControl('password').value;
    const passwordConfirmation = this.getFormControl(
      'passwordConfirmation'
    ).value;
    if (password !== passwordConfirmation) {
      this.error = 'As senhas não coincidem';
      return false;
    }
    return true;
  }

  async onSubmit() {
    if (this.form.valid && this.verifyPasswords()) {
      this.isLoading = true;
      await lastValueFrom(
        this.service.register(
          this.getFormControl('firstName').value,
          this.getFormControl('surName').value,
          this.getFormControl('email').value,
          this.getFormControl('password').value
        )
      )
        .then(() => {
          this.router.navigate(['/']);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
}
