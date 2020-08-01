import {Component, ElementRef, Input, OnInit} from '@angular/core';
import trianglify from 'trianglify';

@Component({
  selector: 'rpg-triangle-gradient',
  templateUrl: './triangle-gradient.component.html',
  styleUrls: ['./triangle-gradient.component.scss']
})
export class TriangleGradientComponent implements OnInit {

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  colors: string[];

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    const pattern = trianglify({
      width: this.width,
      height: this.height,
      cellSize: 20,
      variance: 0.85,
      xColors: this.colors,
      // yColors: [this.colors[0], this.colors[0]],
      colorFunction: ({ xPercent, yPercent, xScale, yScale, opts }) =>
        xScale(xPercent)
    });
    // document.body.appendChild(pattern.toCanvas());

    const canvas: HTMLElement = pattern.toSVG();
    this.elementRef.nativeElement.appendChild(canvas);
  }

}
