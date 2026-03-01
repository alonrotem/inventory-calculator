import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum ActivePage {
  Users,
  AccountRequests,
  AccountInvites
}

@Component({
  selector: 'app-user-tabs',
  standalone: true,
  imports: [ NgClass ],
  templateUrl: './user-tabs.component.html',
  styleUrl: './user-tabs.component.scss'
})
export class UserTabsComponent {
  @Input() ActiveTab : ActivePage = ActivePage.Users;
  ActivePage = ActivePage;

  @Input() CurrentUrl = '';
}
