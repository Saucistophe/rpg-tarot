import {Component, ElementRef, Input, OnInit} from '@angular/core';
import Delaunator from 'delaunator';
import Color from 'color';

@Component({
  selector: 'rpg-triangle-gradient',
  templateUrl: './triangle-gradient.component.html',
  styleUrls: ['./triangle-gradient.component.scss']
})
export class TriangleGradientComponent implements OnInit {

  @Input()
  numberOfXTriangles: number;

  @Input()
  numberOfYTriangles: number;

  @Input()
  colors: string[];

  points: number[][];
  roundedPoints: string[][];
  triangleIndices: number[][];

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.points = [];
    for (let i = -2; i < this.numberOfXTriangles + 2; i++) {
      for (let j = -2; j < this.numberOfYTriangles + 2; j++) {
        this.points.push([(i + 0.7 * (Math.random() - 0.5)) / this.numberOfXTriangles * 100, (j + 0.7 * (Math.random() - 0.5)) / this.numberOfYTriangles * 100]);
      }
    }

    this.roundedPoints = this.points.map(p => [p[0].toFixed(2), p[1].toFixed(2)]);

    const rawTrianglesIndices = Delaunator.from(this.points).triangles;
    this.triangleIndices = [];

    for (let i = 0; i < rawTrianglesIndices.length / 3; i++) {
      this.triangleIndices.push(rawTrianglesIndices.slice(i * 3, i * 3 + 3));
    }
  }

  getColor(triangle: number[]): string {

    const centroidX = (this.points[triangle[0]][0] + this.points[triangle[1]][0] + this.points[triangle[2]][0]) / 3;
    const centroidY = (this.points[triangle[0]][1] + this.points[triangle[1]][1] + this.points[triangle[2]][1]) / 3;

    const xFraction = Math.min(Math.max(centroidX / 100, 0), 1);
    const yFraction = Math.min(Math.max(centroidY / 100, 0), 1);

    return Color('green').darken(yFraction).hex();
  }
}
