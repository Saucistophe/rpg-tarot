import {Component, OnInit} from '@angular/core';
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

  constructor() {
  }

  ngOnInit(): void {
  }

  randomValueForEnum<T>(enumeration: T): T[keyof T] {
    const values = Object.keys(enumeration);
    const enumKey = values[Math.floor((0.5 + Math.random() / 2) * values.length)];
    return enumeration[enumKey];
  }

  skyColorFunction = (x: number, y: number) => {
    switch (this.skyType) {
      case SkyType.CLEAR_DAY:
        return Color('skyblue').lighten((1 - y) / 3).hex();
      case SkyType.DUSK:
        return Color('indigo').rotate(80 * smoothstep(0, 1, y)).lighten(y * 0.8).desaturate(y * 0.1).hex();
      case SkyType.DAWN:
        return Color('orange').rotate(50 * y).lighten(y * 0.8).hex();
      case SkyType.NIGHT:
        return Color('midnightblue').darken(0.8 - 0.8 * y).hex();
      default:
        return 'purple';
    }
  }

  groundColorFunction = (x: number, y: number) => {
    let rawColor: Color;
    switch (this.groundType) {
      case GroundType.DIRT:
        rawColor = Color('saddlebrown').darken(y * 0.7);
        break;
      case GroundType.GRASS:
        rawColor = Color('forestgreen').darken(y * 0.7);
        break;
      case GroundType.ROCK:
        rawColor = Color('darkgray').darken(y * 0.7);
        break;
      case GroundType.SAND:
        rawColor = Color('orange').rotate(10 * y).darken(y * 0.8);
        break;
      default:
        rawColor = Color('purple');
    }

    switch (this.skyType) {
      case SkyType.DUSK:
        rawColor = rawColor.darken(0.2).mix(Color('yellow'), 0.1);
        break;
      case SkyType.DAWN:
        rawColor = rawColor.darken(0.2).mix(Color('red'), 0.1);
        break;
      case SkyType.NIGHT:
        rawColor = rawColor.darken(0.35).mix(Color('midnightblue'), 0.1);
        break;
      case SkyType.CLEAR_DAY:
        default:
    }
    return rawColor.hex();
  }
}
