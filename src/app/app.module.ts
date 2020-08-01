import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { TriangleGradientComponent } from './triangle-gradient/triangle-gradient.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    TriangleGradientComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
