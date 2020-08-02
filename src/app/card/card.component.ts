import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import * as Color from 'color';
import * as smoothstep from 'smoothstep';

enum SkyType {
  CLEAR_DAY,
  NIGHT,
  DUSK,
  DAWN,
}

enum GroundType {
  GRASS,
  DIRT,
  ROCK,
  SAND
}

@Component({
  selector: 'rpg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  skyType = this.randomValueForEnum(SkyType);
  groundType = this.randomValueForEnum(GroundType);

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  randomValueForEnum<T>(enumeration: T): T[keyof T] {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor((0.5 + Math.random() / 2) * values.length)];
    return enumeration[enumKey];
  }

  get skyColorFunction(): ((x: number, y: number) => string) {
    switch (this.skyType) {
      case SkyType.CLEAR_DAY:
        return (x: number, y: number) => Color('skyblue').lighten((1 - y) / 3).hex();
      case SkyType.DUSK:
        return (x: number, y: number) => Color('indigo').rotate(80 * smoothstep(0, 1, y)).lighten(y *  0.8).desaturate(y * 0.1).hex();
      case SkyType.DAWN:
        return (x: number, y: number) => Color('orange').rotate(50 * y).lighten(y * 0.8 ).hex();
      case SkyType.NIGHT:
        return (x: number, y: number) => Color('midnightblue').darken(0.8 - 0.8 * y).hex();
      default:
        return (x: number, y: number) => 'purple';
    }
  }

  get groundColorFunction(): ((x: number, y: number) => string) {
    switch (this.groundType) {
      case GroundType.DIRT:
        return (x: number, y: number) =>  Color('saddlebrown').darken(y).hex();
      case GroundType.GRASS:
        return (x: number, y: number) =>  Color('green').darken(y).hex();
      case GroundType.ROCK:
        return (x: number, y: number) => Color('dimgray').darken(y * 0.8 ).hex();
      case GroundType.SAND:
        return (x: number, y: number) => Color('orange').rotate(10 * y).darken(y * 0.8 ).hex();
      default:
        return (x: number, y: number) => 'purple';
    }
  }
}
