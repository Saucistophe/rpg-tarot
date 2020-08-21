import { Component } from '@angular/core';
import { AvatarType } from './model/avatar-type.enum';

@Component({
  selector: 'rpg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rpg-tarot';

  get avatars(): Array<string> {
    return Object.keys(AvatarType).filter((k) => isNaN(Number(AvatarType[k as any])));
  }
}
