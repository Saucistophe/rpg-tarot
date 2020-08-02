import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import Color from 'color';

@Component({
  selector: 'rpg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  skyColorFunction(x: number, y: number): string {
    return Color('skyblue').lighten((1 - y) / 3).hex();
  }
}
