import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  user: User = null;

  constructor(private route: ActivatedRoute,private router: Router, private authService: AuthService) { }

  ngOnInit() {
    let username = this.route.snapshot.paramMap.get("username")

    this.authService.findUser(username).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    })
  }

}
