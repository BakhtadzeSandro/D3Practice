import { Routes } from '@angular/router';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { PracticeComponent } from './components/practice/practice.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-page',
    pathMatch: 'full',
  },
  {
    path: 'main-page',
    component: MainPageComponent,
    children: [
      {
        path: 'bar-chart',
        component: BarChartComponent,
      },
      {
        path: 'line-chart',
        component: LineChartComponent,
      },
      {
        path: 'pie-chart',
        component: PieChartComponent,
      },
      {
        path: 'practice',
        component: PracticeComponent,
      },
    ],
  },
];
