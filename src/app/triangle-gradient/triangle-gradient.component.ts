import {Component, ElementRef, Input, OnInit} from '@angular/core';
import Delaunator from 'delaunator';
import * as Color from 'color';

@Component({
  selector: 'rpg-triangle-gradient',
  templateUrl: './triangle-gradient.component.html',
  styleUrls: ['./triangle-gradient.component.scss']
})
export class TriangleGradientComponent implements OnInit {

  points: number[][];
  roundedPoints: string[][];
  triangleIndices: number[][];

  @Input()
  yStretchPercentage = 100;

  @Input()
  numberOfXTriangles: number;

  @Input()
  numberOfYTriangles: number;

  @Input()
  colors: string[];

  @Input()
  colorFunction = (x: number, y: number) => Color('green').darken(y).hex();

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.points = [];
    // Create a grid of points. They are spaced evenly across a [0,100] square.
    // Two points are added before and beyond the grid to ensure there are enough material to create edge triangles.
    // A variation of roughly a third of a cell is added to spice things up without messing triangles.
    for (let i = -2; i < this.numberOfXTriangles + 2; i++) {
      for (let j = -2; j < this.numberOfYTriangles + 2; j++) {
        const x = (i + 0.7 * (Math.random() - 0.5)) / this.numberOfXTriangles * 100;
        const y = (j + 0.7 * (Math.random() - 0.5)) / this.numberOfYTriangles * this.yStretchPercentage;
        this.points.push([x, y]);
      }
    }

    // Prepare a list of strings, rounded at one decimal to avoid silly numbers.
    this.roundedPoints = this.points.map(p => [p[0].toFixed(1), p[1].toFixed(1)]);

    // Create a Delaunay triangulation
    const rawTrianglesIndices = Delaunator.from(this.points).triangles;

    // Group the indices into triplets
    this.triangleIndices = [];
    for (let i = 0; i < rawTrianglesIndices.length / 3; i++) {
      this.triangleIndices.push(rawTrianglesIndices.slice(i * 3, i * 3 + 3));
    }

    // Sort by centroid Y
    this.triangleIndices.sort((t1, t2) => {
      const y1 = t1.map(i => this.points[i][1]).reduce((a, v) => a + v);
      const y2 = t1.map(i => this.points[i][1]).reduce((a, v) => a + v);
      return y1 - y2;
    });
  }

  getColor(shapeIndices: number[]): string {
    let centroidX = 0;
    let centroidY = 0;
    for (const i of shapeIndices) {
      centroidX += this.points[i][0];
      centroidY += this.points[i][1];
    }
    centroidX /= shapeIndices.length;
    centroidY /= shapeIndices.length;

    const xFraction = Math.min(Math.max(centroidX / 100, 0), 1);
    const yFraction = Math.min(Math.max(centroidY / this.yStretchPercentage, 0), 1);

    return this.colorFunction(xFraction, yFraction);
  }

  getEdgeColor(triangle: number[]): string {
    const triangleColor = Color(this.getColor(triangle));

    return Color(triangleColor).darken(0.1).hex();
  }

  get edges(): number[][] {
    console.log(this.triangleIndices.flatMap(t => [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]));
    return this.triangleIndices.flatMap(t => [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]);
  }
}
