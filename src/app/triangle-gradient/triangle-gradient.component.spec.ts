import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriangleGradientComponent } from './triangle-gradient.component';

describe('TriangleGradientComponent', () => {
  let component: TriangleGradientComponent;
  let fixture: ComponentFixture<TriangleGradientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriangleGradientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriangleGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
