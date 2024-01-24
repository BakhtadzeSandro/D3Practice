import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  routes = [
    {
      text: 'See Bar chart',
      navigateTo: 'bar-chart',
    },
    {
      text: 'See Pie chart',
      navigateTo: 'pie-chart',
    },
    {
      text: 'See Line chart',
      navigateTo: 'line-chart',
    },
    {
      text: 'Practice Charts',
      navigateTo: 'practice',
    },
  ];
}
