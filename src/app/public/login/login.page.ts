import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  // For ease in reference
  error: {
    email: string;
    password: string;
  };
  logging = false;
  loginFailed = false;
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email],
        this.authService.emailExists.bind(this.authService)
      ],
      password: ['', [Validators.required]]
    });
    this.error = {
      email: '',
      password: ''
    };
  }

  validate(field: string) {
    return this.authService.validate(this.loginForm, field, this.error);
  }

  login() {
    // If user gets past the initial checks
    if (!this.loginForm.valid) return;
    this.logging = true;
    this.authService
      .login(this.email.value, this.password.value)
      .then(() => {
        // Login complete
        this.loginFailed = false;
        this.logging = false;
      })
      .catch(err => {
        // Password failed
        this.loginFailed = true;
        this.logging = false;
      });
  }

  async resetPassword() {
    this.alertService
      .confirmation('Are you sure you want to reset your password?', () => {
        // On Confirmation
        this.authService.resetPassword(this.email.value);
        this.loginFailed = false;
      })
      .catch(this.alertService.error);
  }

  // Getters
  get email(): AbstractControl {
    return this.loginForm.get('email');
  }
  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
