import { Injectable } from '@angular/core';

export enum Avatar {
  FULL_MOON,
  SUN,
  CHEST,
  BAG,
  BOAT,
}

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor() {}

  public getPolygonPoints(avatar: Avatar) {
    switch (avatar) {
      case Avatar.SUN:
        return '0,100 0,0 100,0 100,100';
        break;

      default:
        return '0,100 50,25 50,75 100,0';
        break;
    }
  }
}
