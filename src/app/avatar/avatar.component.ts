import { Component, OnInit, Input } from '@angular/core';
import { AvatarType } from '../model/avatar-type.enum';
import Delaunator from 'delaunator';
import Color from 'color';

export interface DrawingPart {
  contourPoints: number[][];
  triangleVertices?: number[][];
  triangleIndices?: number[][];
  colorFunction: (coordinates: number[]) => string;
  edgeColorFunction: (coordinates: number[]) => string;
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
        this.drawingParts.push({
          contourPoints: [
            [72, 50],
            [70, 58],
            [66, 66],
            [58, 70],
            [50, 72],
            [42, 70],
            [34, 66],
            [30, 58],
            [28, 50],
            [30, 42],
            [34, 34],
            [42, 30],
            [50, 28],
            [58, 30],
            [66, 34],
            [70, 42],
          ],
          colorFunction: (coordinates: number[]) =>
            Color('orange')
              .mix(Color('yellow'), this.gradient(Math.min(...coordinates), 28,72))
              .hex(),
          edgeColorFunction: (coordinates: number[]) =>
            Color('red')
              .mix(Color('orange'), this.gradient(Math.min(...coordinates), 28,72))
              .hex(),
        });
        break;
      default:
    }

    // Create a grid
    const grid: number[][] = [];
    const gridStep = 10;
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
      const triangleVertices = grid.filter((p) =>
        this.inside(p, part.contourPoints)
      );
      // Run a Delaunay triangulation
      part.triangleVertices = [...triangleVertices, ...part.contourPoints];
      part.triangleIndices = [];
      const rawTrianglesIndices = Delaunator.from(part.triangleVertices)
        .triangles;
      for (let i = 0; i < rawTrianglesIndices.length / 3; i++) {
        part.triangleIndices.push(rawTrianglesIndices.slice(i * 3, i * 3 + 3));
      }
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

  centroid(vertices: number[][], triangleIndices: number[]): number[] {
    const x =
      vertices[triangleIndices[0]][0] +
      vertices[triangleIndices[1]][0] +
      vertices[triangleIndices[2]][0];
    const y =
      vertices[triangleIndices[0]][1] +
      vertices[triangleIndices[1]][1] +
      vertices[triangleIndices[2]][1];

    return [x / 3, y / 3];
  }

  gradient(x, xMin, xMax): number {
    let result = (x - xMin) / (xMax - xMin);
    result = Math.max(0, result);
    result = Math.min(1, result);
    return result;
  }
}
