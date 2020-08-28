import { Component } from '@angular/core';
import { AvatarType } from './model/avatar-type.enum';

@Component({
  selector: 'rpg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rpg-tarot';

  get avatars(): Array<AvatarType> {
  //  return [...Array(Object.keys(AvatarType).length/2).keys()];
  return [AvatarType.SUN];
  }
}
