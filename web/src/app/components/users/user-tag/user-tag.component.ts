import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-tag',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './user-tag.component.html',
  styleUrl: './user-tag.component.scss'
})
export class UserTagComponent {
  @Input() firstname: string = "";
  @Input() lastname: string = "";
  @Input() email: string = "";
  @Input() photo_url: string = "";
  @Input() user_id: number = 0;

  environment = environment;

  getInitials(){
    //this.userInfo = userInfo;
    let initials = "";
    if(this.firstname) {
      initials = this.firstname[0];
    }
    if(this.lastname) {
      initials += this.lastname[0];
    }
    else if (this.firstname.length > 1) {
      initials += this.firstname[1];
    }
    return initials;
  }
}
