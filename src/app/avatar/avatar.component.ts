import { Component, OnInit, Input } from '@angular/core';
import { AvatarType } from '../model/avatar-type.enum';
import Delaunator from 'delaunator';
import cdt2d from 'cdt2d';
import Color from 'color';

export class DrawingPart {
  public vertices: number[][] = [];
  public triangleIndices: number[][] = [];

  constructor(
    public contourPoints: number[][],
    public colorFunction: (coordinates: number[]) => string,
    public edgeColorFunction = (coordinates: number[]) => 'black'
  ) {}

  public get edges(): number[][] {
    return this.triangleIndices.flatMap((t) => [
      [t[0], t[1]],
      [t[1], t[2]],
      [t[2], t[0]],
    ]);
  }
}

@Component({
  selector: 'rpg-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  AvatarType = AvatarType;

  @Input()
  avatarType: AvatarType;

  drawingParts: DrawingPart[] = [];

  constructor() {}

  ngOnInit(): void {
    switch (this.avatarType) {
      case AvatarType.SUN:
        // Generated using JSON.stringify([...Array(16).keys()].map(i => [Math.cos(i/8*Math.PI),Math.sin(i/8*Math.PI)].map(x => Math.round(x*22+50))));
        this.drawingParts.push(
          // prettier-ignore
          new DrawingPart(
            [
              [72, 50], [70, 58], [66, 66], [58, 70], [50, 72], [42, 70],
              [34, 66], [30, 58], [28, 50], [30, 42], [34, 34], [42, 30],
              [50, 28], [58, 30], [66, 34], [70, 42],
            ],
            (coordinates: number[]) =>
              Color('orange')
                .mix(
                  Color('yellow'),
                  this.gradient(Math.min(...coordinates), 28, 60)
                )
                .hex(),
            (coordinates: number[]) =>
              Color('gold')
                .mix(
                  Color('orange'),
                  this.gradient(Math.min(...coordinates), 28, 70)
                )
                .hex()
          )
        );

        this.drawingParts.push(
          // prettier-ignore
          new DrawingPart(
            [
              [55, 75], [45, 75], [45, 82], [48,90], [45,100], [50, 90], [52, 82],
            ],
            (coordinates: number[]) =>
              Color('red')
                .mix(
                  Color('orange'),
                  this.gradient(coordinates[0], 100, 75)
                )
                .hex(),
            (coordinates: number[]) =>
              Color('gold')
                .mix(
                  Color('orange'),
                  this.gradient(Math.min(...coordinates), 28, 70)
                )
                .hex()
          )
        );
        break;
      default:
    }

    // Create a grid
    const grid: number[][] = [];
    const gridStep = 8;
    for (let i = 0; i <= 100; i += gridStep) {
      for (let j = 0; j <= 100; j += gridStep) {
        // Mess it up a little
        const x = i + gridStep * 0.7 * (Math.random() - 0.5);
        const y = j + gridStep * 0.7 * (Math.random() - 0.5);
        grid.push([x, y]);
      }
    }

    this.drawingParts.forEach((part) => {
      // Keep only grid vertices inside the contour
      const vertices = grid.filter((p) => this.inside(p, part.contourPoints));
      // Run a Delaunay triangulation on the contour and grid points
      part.vertices = [...part.contourPoints, ...vertices];
      const outerContourEdges = [...Array(part.contourPoints.length - 1).keys()].map(i =>[i, i+1]);
      outerContourEdges.push([part.contourPoints.length - 1,0]);
      part.triangleIndices = cdt2d(part.vertices, outerContourEdges, {exterior: false});
    });
  }

  private inside(point, contourVertices) {
    // Ray-casting algorithm based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    const x = point[0],
      y = point[1];

    let inside = false;
    for (
      let i = 0, j = contourVertices.length - 1;
      i < contourVertices.length;
      j = i++
    ) {
      const xi = contourVertices[i][0],
        yi = contourVertices[i][1];
      const xj = contourVertices[j][0],
        yj = contourVertices[j][1];

      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  centroid(vertices: number[][], shapeIndices: number[]): number[] {
    let centroidX = 0;
    let centroidY = 0;
    for (const i of shapeIndices) {
      centroidX += vertices[i][0];
      centroidY += vertices[i][1];
    }
    centroidX /= shapeIndices.length;
    centroidY /= shapeIndices.length;

    return [centroidX, centroidY];
  }

  gradient(x, xMin, xMax): number {
    let result = (x - xMin) / (xMax - xMin);
    result = Math.max(0, result);
    result = Math.min(1, result);
    return result;
  }
}
