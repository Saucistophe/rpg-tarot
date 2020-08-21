import { Component, OnInit, Input } from '@angular/core';
import { AvatarType } from '../model/avatar-type.enum';

@Component({
  selector: 'rpg-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input()
  avatarType: AvatarType;

  AvatarType= AvatarType;

  constructor() { }

  ngOnInit(): void {
  }

}
