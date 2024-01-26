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
  // // Main elements
  // host: any;
  // svg: any;

  // // Dimensions
  // dimensions: DOMRect | undefined;
  // innerWidth: number | undefined;
  // innerHeight: number | undefined;

  // margins = {
  //   left: 50,
  //   top: 40,
  //   right: 20,
  //   bottom: 80,
  // };

  // // Containers

  // dataContainer: any;
  // xAxisContainer: any;
  // yAxisContainer: any;
  // legendContainer: any;

  // // Label

  // title: any;

  // // Time formatters

  // timeparse = d3.timeParse('%Y%mYd');
  // niceData = d3.timeFormat('%Y-%B');

  // // Scales

  // x: any;
  // y: any;
  // colors: any;

  // constructor(element: ElementRef) {
  //   this.host = d3.select(element.nativeElement);
  // }

  // ngOnInit() {
  //   this.svg = this.host.select('svg');
  //   this.setDimensions();
  //   this.setElements();
  //   this.updateChart();
  //   console.log(this.svg);
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (!this.svg) {
  //     return;
  //   } else {
  //     this.updateChart();
  //   }
  // }

  // setDimensions() {
  //   this.dimensions = this.svg.node().getBoundingClientRect();

  //   if (this.dimensions) {
  //     this.innerWidth =
  //       this.dimensions.width - this.margins.left - this.margins.right;
  //     this.innerHeight =
  //       this.dimensions.height - this.margins.top - this.margins.bottom;
  //   }

  //   this.svg.attr('viewBox', [
  //     0,
  //     0,
  //     this.dimensions?.width,
  //     this.dimensions?.height,
  //   ]);
  // }

  // setElements() {
  //   if (this.innerHeight) {
  //     this.xAxisContainer = this.svg
  //       .append('g')
  //       .attr('class', 'xAxisContainer')
  //       .attr(
  //         'transform',
  //         `translate(${this.margins.left}, ${
  //           this.margins.top + this.innerHeight
  //         })`
  //       );
  //   }

  //   this.yAxisContainer = this.svg
  //     .append('g')
  //     .attr('class', 'yAxisContainer')
  //     .attr(
  //       'transform',
  //       `translate(${this.margins.left}, ${this.margins.top})`
  //     );

  //   if (this.dimensions && this.innerWidth) {
  //     this.title = this.svg
  //       .append('g')
  //       .attr('class', 'titleContainer')
  //       .attr(
  //         'transform',
  //         `translate(${this.margins.left + 0.5 * this.innerWidth}, ${
  //           this.dimensions?.height - 5
  //         })`
  //       )
  //       .append('text')
  //       .attr('class', 'label')
  //       .style('text-anchor', 'middle');
  //   }

  //   this.dataContainer = this.svg
  //     .append('g')
  //     .attr('class', 'dataContainer')
  //     .attr(
  //       'transform',
  //       `translate(${this.margins.left}, ${this.margins.top})`
  //     );

  //   if (this.dimensions) {
  //     this.legendContainer = this.svg
  //       .append('g')
  //       .append('g')
  //       .attr('class', 'legendContainer')
  //       .attr(
  //         'transform',
  //         `translate(${this.margins.left}, ${
  //           this.dimensions?.height - 0.5 * this.margins.bottom + 10
  //         })`
  //       );
  //   }
  // }

  // setParams() {
  //   // Domains

  //   const xDomain = [0, Date.now()];
  //   const yDomain = [0, 100];
  //   const colorDomain = ['A', 'B', 'C'];
  //   // Ranges

  //   const xRange = [0, this.innerWidth];
  //   const yRange = [this.innerHeight, 0];
  //   const colorRange = d3.schemeCategory10;

  //   // Set scales
  //   this.x = d3.scaleTime().domain(xDomain);
  //   this.y = d3.scaleLinear();
  //   this.colors = d3.scaleOrdinal();
  // }

  // setLabels() {}

  // setAxis() {}

  // setLegend() {}

  // draw() {}

  // updateChart() {
  //   this.setParams();
  //   this.setLabels();
  //   this.setAxis();
  //   this.setLegend();
  //   this.draw();
  // }

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
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    let chosenDepartmentData = data.filter((x) => {
      return x.Department == this.selectedDepartment;
    });
    console.log(chosenDepartmentData);
    for (const [key, value] of Object.entries(chosenDepartmentData[0])) {
      if (typeof value != 'string') {
        this.changedData.push({ year: key, spending: value });
      }
    }

    console.log(this.changedData);
    this.x.domain(d3Array.extent(this.changedData, (d) => d.year));
    this.y.domain(d3Array.extent(this.changedData, (d) => d.spending));

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
