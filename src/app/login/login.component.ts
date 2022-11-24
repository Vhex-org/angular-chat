import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import FormValues from '../Entity/FormValues.entity';

// Backend
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log('LoginComponent INIT');
  }

  login() {
    this.userService.login(this.loginForm.value as FormValues);
  }
}
