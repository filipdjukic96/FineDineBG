import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userAuthenticated = false;
  userType: string = null;
  username: string = null;
  constructor(private service: AuthService, private router: Router) { }

  ngOnInit() {

    this.userAuthenticated = this.service.getAuthStatus();
    this.userType = this.service.getType();
    this.username = this.service.getUsername();

    this.authListenerSubs = this.service.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userAuthenticated = isAuthenticated;
        this.userType = this.service.getType();
        this.username = this.service.getUsername();
      }
    );
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.service.logout();
    this.userType = null;
    this.username = null;
  }

}
