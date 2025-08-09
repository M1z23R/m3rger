import { Component, model } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  imports: [],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent {
  progress = model.required<number>();

}
