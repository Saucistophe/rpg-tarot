import { Component } from '@angular/core';
import { Avatar } from './services/avatar.service';

@Component({
  selector: 'rpg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rpg-tarot';

  get avatars(): Array<string> {
    return Object.keys(Avatar).filter((k) => isNaN(Number(Avatar[k as any])));
  }
}
