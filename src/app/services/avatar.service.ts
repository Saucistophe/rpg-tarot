import { Injectable } from '@angular/core';
import { AvatarType } from '../model/avatar-type.enum';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor() {}

  public getPolygonPoints(avatar: AvatarType) {
    switch (avatar) {
      case AvatarType.SUN:
        return '0,100 0,0 100,0 100,100';

      default:
        return '0,100 50,25 50,75 100,0';
    }
  }
}
