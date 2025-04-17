import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'o-login',
  imports: [CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
