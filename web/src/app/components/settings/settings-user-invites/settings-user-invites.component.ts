import { Component } from '@angular/core';
import { ActivePage, UserTabsComponent } from "../user-tabs/user-tabs.component";

@Component({
  selector: 'app-settings-user-invites',
  standalone: true,
  imports: [UserTabsComponent],
  templateUrl: './settings-user-invites.component.html',
  styleUrl: './settings-user-invites.component.scss'
})
export class SettingsUserInvitesComponent {
  ActivePage = ActivePage;
}
