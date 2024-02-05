import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  providers: [DataService],
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
