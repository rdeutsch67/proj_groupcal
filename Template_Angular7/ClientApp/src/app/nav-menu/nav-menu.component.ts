import { Component } from '@angular/core';
import {NavbarService} from "../services/navbar.service";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent {

  isCollapsed = true;

  constructor( public nav: NavbarService ) {}

  collapse() {
    this.isCollapsed = true;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
