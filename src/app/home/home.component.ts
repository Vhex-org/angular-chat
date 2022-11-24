import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// back
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    if (!this.userService.getJwt()) {
      this.router.navigate(['/login']);
    }
  }

}
