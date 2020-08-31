import { Component, OnInit, Input } from '@angular/core';
import { AvatarType } from '../model/avatar-type.enum';
import cdt2d from 'cdt2d';
import Color from 'color';

export class DrawingPart {
  public vertices: number[][] = [];
  public triangleIndices: number[][] = [];
  private gradientStop1: number[];
  private gradientStop2: number[];

  constructor(
    public contourPoints: number[][],
    private color1: string,
    private color2: string,
    // 0 degrees: left to right, 90: bottom to top.
    private gradientAngleDegrees: number,
    private gradientSpansWholeCanvas = false
  ) {
    let gradientBoundaries = gradientSpansWholeCanvas ? [[0,0],[0,100],[100,0],[100,100]]: contourPoints.concat();
    gradientBoundaries.forEach(p => {p.push(this.projectOnGradient(p[0], p[1]))});
    gradientBoundaries.sort((p1,p2) => p1[2] - p2[2]);
    this.gradientStop1 = gradientBoundaries[0];
    this.gradientStop2 = gradientBoundaries[gradientBoundaries.length - 1];
  }

  private projectOnGradient(x: number, y: number) {
    // Consider a line running from [0,0] towards the desired angle.
    const referenceLineX = Math.cos(this.gradientAngleDegrees * Math.PI / 180);
    const referenceLineY = Math.sin(this.gradientAngleDegrees * Math.PI / 180);
    return x * referenceLineX + y * referenceLineY;
  }

  public getColor([x,y]: number[]) {
  const vx = this.gradientStop2[0] - this.gradientStop1[0];
  const vy = this.gradientStop2[1] - this.gradientStop1[1];
  const dotProduct = (x - this.gradientStop1[0]) * vx
    + (y - this.gradientStop1[1]) * vy;
  let ratio = dotProduct / (vx * vx + vy * vy);
    ratio = Math.max(0, ratio);
    ratio = Math.min(1, ratio);

    return Color(this.color1)
        .mix(Color(this.color2), ratio)
        .hex();
  }

  /**
   * @returns A list of all triangles' possible edges, in the form of pair of vertex indices.
   */
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
              [80,50],[78,61],[71,71],[61,78],[50,80],[39,78],[29,71],
              [22,61],[20,50],[22,39],[29,29],[39,22],[50,20],[61,22],
              [71,29],[78,39]
            ],
            'orange', 'yellow', 180
          )
        );

        this.drawingParts.push(
          // prettier-ignore
          new DrawingPart([[45.5,82],[54.5,82],[51.5,87],[53.5,94],[48.5,100],[49.5,96],[45.5,89]],
            'red', 'orange', 0
          )
        );

        this.drawingParts.push(
          // prettier-ignore
          new DrawingPart([[82,54.5],[82,45.5],[87,48.5],[94,46.5],[100,51.5],[96,50.5],[89,54.5]],
          'red', 'orange', 0
          )
        );

        this.drawingParts.push(
          // prettier-ignore
          new DrawingPart([[54.5,18],[45.5,18],[48.5,13],[46.5,6],[51.5,0],[50.5,4],[54.5,11]],
          'red', 'orange', 0
          )
        );

        this.drawingParts.push(
          // prettier-ignore
          new DrawingPart([[18,45.5],[18,54.5],[13,51.5],[6,53.5],[0,48.5],[4,49.5],[11,45.5]],
          'red', 'orange', 0
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
      const outerContourEdges = [
        ...Array(part.contourPoints.length - 1).keys(),
      ].map((i) => [i, i + 1]);
      outerContourEdges.push([part.contourPoints.length - 1, 0]);
      part.triangleIndices = cdt2d(part.vertices, outerContourEdges, {
        exterior: false,
      });
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
}
