import { Component, OnInit, Input } from '@angular/core';
import { AvatarType } from '../model/avatar-type.enum';
import Delaunator from 'delaunator';
import Color from 'color';

export interface DrawingPart {
  contourPoints: number[][];
  triangleVertices?: number[][];
  triangleIndices?: number[][];
  colorFunction: (x: number, y: number) => string;
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
        this.drawingParts.push({
          contourPoints: [
            [50, 72],
            [72, 50],
            [50, 28],
            [28, 50],
          ],
          colorFunction: (x, y) =>
            Color('yellow')
              .lighten(Math.max(x, y) / 100)
              .hex(),
        });
        break;
      default:
    }

    // Create a grid
    const grid: number[][] = [];
    const gridStep = 4;
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
}
