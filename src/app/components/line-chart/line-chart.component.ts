import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import data from '../../../assets/us-spending-since-2000-v3.json';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit {
  changedData: any[] = [];

  private margin = { top: 20, right: 20, bottom: 30, left: 100 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: any; // this is line defination
  selectedDepartment: any;
  departments: any[] = [];

  constructor() {
    // configure margins and width/height of the graph
    this.width = 800;
    this.height = 400;
  }

  public ngOnInit(): void {
    this.setDepartments();
    this.selectedDepartment = data[0].Department;
    this.buildSvg();
    this.addXandYAxis();
    this.drawChart();
  }

  private setDepartments() {
    this.departments = data.map((item) => item.Department);
  }

  private buildSvg() {
    this.svg = d3
      .select('svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
  }
  private addXandYAxis() {
    const maxNum: any = d3.max(this.changedData);
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale
      .scaleLinear()
      .domain([0, 100000000])
      .range([this.height, 0]);
    let chosenDepartmentData = data.filter((x) => {
      return x.Department == this.selectedDepartment;
    });
    for (const [key, value] of Object.entries(chosenDepartmentData[0])) {
      if (typeof value != 'string') {
        this.changedData.push({ year: key, spending: value });
      }
    }

    this.x.domain(d3Array.extent(this.changedData, (d) => d.year));
    this.y.domain([0, d3Array.max(this.changedData, (d) => d.spending)]);

    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y).ticks(8));
  }

  private drawChart() {
    const line = d3
      .line()
      .x((d: any) => this.x(d.year))
      .y((d: any) => this.y(d.spending))
      .curve(d3.curveMonotoneX);

    const path = this.svg
      .append('g')
      .attr('class', 'line-chart')
      .append('path')
      .datum(this.changedData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    const totalLength = path.node().getTotalLength();

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(800)
      .attr('stroke-dashoffset', 0);

    // Add dots along the line
    this.svg
      .selectAll('.dot')
      .data(this.changedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: any) => this.x(d.year))
      .attr('cy', (d: any) => this.y(d.spending))
      .attr('r', 5)
      .style('fill', 'black')
      .on('mouseover', (event: any, d: any) => {
        const dataOnHover = {
          year: d.year,
          spending: d.spending,
        };
        this.setTooltips(event, dataOnHover);
      })
      .on('mouseout', () => {
        d3.select('.tooltip').remove();
      });
  }

  setTooltips(event: MouseEvent, content: any) {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('padding', '5px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px');

    const x = event.pageX + 10;
    const y = event.pageY - 10;
    const expense = d3.format('$,.0f')(+content.spending);

    tooltip.style('left', `${x}px`).style('top', `${y}px`).html(`
    <p><strong>Year:</strong> ${content.year}</p>
    <p><strong>Spending:</strong> ${expense}</p>
    <p><strong>Department:</strong> ${this.selectedDepartment}</p>`);

    d3.select(event.target as any).on('mouseout', () => tooltip.remove());
  }

  public updateChart() {
    this.svg.selectAll('*').remove();
    this.changedData = [];
    this.addXandYAxis();
    this.drawChart();
  }
}
