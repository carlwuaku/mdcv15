import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() showBackButton:boolean = false;
  items: MenuItem[] = [];
  constructor(public authService: AuthService, private route: ActivatedRoute) {

  }
  logout() {
    this.authService.logout();
    //send user to login page
    window.location.assign('/');
  }
}
