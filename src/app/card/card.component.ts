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
    let color: Color;

    switch (this.skyType) {
      case SkyType.CLEAR_DAY:
        color = Color('skyblue').lighten((1 - y) / 3);
        break;
      case SkyType.DUSK:
        color = Color('indigo').rotate(80 * smoothstep(0, 1, y)).lighten(y * 0.8).desaturate(y * 0.1);
        break;
      case SkyType.DAWN:
        color = Color('orange').rotate(50 * y).lighten(y * 0.8);
        break;
      case SkyType.NIGHT:
        color = Color('midnightblue').darken(0.8 - 0.8 * y);
        break;
      default:
        color = Color('purple');
        break;
    }

    // Clouds
    // color = color.mix(Color('gray'), Math.max(0, 0.8 - 0.4 * Math.abs(y - 0.2)));

    return color.hex();
  }

  groundColorFunction = (x: number, y: number) => {
    let color: Color;

    switch (this.groundType) {
      case GroundType.DIRT:
        color = Color('saddlebrown').darken(y * 0.7);
        break;
      case GroundType.GRASS:
        color = Color('forestgreen').darken(y * 0.7);
        break;
      case GroundType.ROCK:
        color = Color('darkgray').darken(y * 0.7);
        break;
      case GroundType.SAND:
        color = Color('orange').rotate(10 * y).darken(y * 0.8);
        break;
      default:
        color = Color('purple');
    }

    switch (this.skyType) {
      case SkyType.DUSK:
        color = color.darken(0.2).mix(Color('yellow'), 0.1);
        break;
      case SkyType.DAWN:
        color = color.darken(0.2).mix(Color('red'), 0.1);
        break;
      case SkyType.NIGHT:
        color = color.darken(0.35).mix(Color('midnightblue'), 0.1);
        break;
      case SkyType.CLEAR_DAY:
      default:
    }
    return color.hex();
  }
}
