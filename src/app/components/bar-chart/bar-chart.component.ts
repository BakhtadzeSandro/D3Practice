import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import data from '../../../assets/us-spending-since-2000-v3.json';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit {
  constructor(private dataService: DataService) {}
  departments: any[] = [];
  private maxNumber: number = 0;
  private chartdata: any;
  private svg: any;
  private tooltip: any;
  private margin = { top: 50, right: 50, bottom: 70, left: 150 };
  private width = 1000 - this.margin.left - this.margin.right;
  private height = 400;
  private colors = ['#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  createTooltip(): void {
    this.tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('background', '#dbd8e3')
      .style('padding', '10px')
      .style('border-radius', '8px');
  }

  ready(data: any): void {
    this.chartdata = this.getData(data);
    this.drawBars(this.chartdata);
  }

  createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }

  getData(data: any): any[] {
    const filteredData: any[] = [];
    data.map((v: any) => {
      this.findMaxNumber({
        2018: v[2018],
        2019: v[2019],
        2020: v[2020],
        2021: v[2021],
        2022: v[2022],
      });
      filteredData.push({
        2018: v[2018],
        2019: v[2019],
        2020: v[2020],
        2021: v[2021],
        2022: v[2022],
        Department: String(v.Department),
      });
    });

    return filteredData;
  }

  findMaxNumber(data: any): void {
    const num = d3.max(Object.values(data));
    if (num && this.maxNumber < +num) {
      this.maxNumber = +num;
    }
  }

  drawBars(data: any[]): void {
    const years = ['2018', '2019', '2020', '2021', '2022'];

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.Department))
      .range(['#e377c2', '#7f7f7f', '#bcbd22', '#17becf']);

    const x = d3
      .scaleBand()
      .range([0, this.width - this.margin.left])
      .domain(years.map((d) => d))
      .padding(0.2);

    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height / 2 + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(0)');

    const y = d3
      .scaleLinear()
      .domain([0, this.maxNumber])
      .range([this.height / 2, 0]);

    this.svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('$,.0f')));

    years.forEach((year) => {
      const k: any = x(year);
      this.svg
        .selectAll('bars')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d: any, i: any) => k + (x.bandwidth() * i) / years.length)
        .attr('y', (d: any) => y(d[year]))
        .attr('width', x.bandwidth() / years.length)
        .attr('height', (d: any) => this.height / 2 - y(d[year]))
        .attr('fill', (d: any) =>
          d && d.Department && color(d.Department)
            ? color(d.Department)
            : '#DC143C'
        )
        .on('mouseover', (event: any, d: any) => {
          this.tooltip.style('visibility', 'visible');
          this.tooltip.html(
            'Year: ' +
              year +
              '<br>' +
              'Department: ' +
              d.Department +
              '<br>' +
              'Spending: ' +
              d3.format('($,')(d[year])
          );
        })
        .on('mousemove', (event: any) => {
          const [mouseX, mouseY] = d3.pointer(event);
          return this.tooltip
            .style('top', mouseY + this.margin.top + 'px')
            .style('left', mouseX + this.margin.left + 'px');
        })
        .on('mouseout', () => {
          return this.tooltip.style('visibility', 'hidden');
        });
    });
  }

  ngOnInit(): void {
    this.createTooltip();
    this.createSvg();

    this.dataService
      .getData('../../../assets/us-spending-since-2000-v3.json')
      .subscribe((data: any) => {
        this.ready(data);
        data.map((x, index) => {
          let newObj = {
            department: x.Department,
            color: this.colors[index],
          };
          this.departments.push(newObj);
        });
      });
  }
}
