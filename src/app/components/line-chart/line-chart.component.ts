import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/us-spending-since-2000-v3.json';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit {
  // Main elements
  host: any;
  svg: any;

  // Dimensions
  dimensions: DOMRect | undefined;
  innerWidth: number | undefined;
  innerHeight: number | undefined;

  margins = {
    left: 50,
    top: 40,
    right: 20,
    bottom: 80,
  };

  // Containers

  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;
  legendContainer: any;

  // Label

  title: any;

  // Time formatters

  timeparse = d3.timeParse('%Y%mYd');
  niceData = d3.timeFormat('%Y-%B');

  // Scales

  x: any;
  y: any;
  colors: any;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }

  ngOnInit() {
    this.svg = this.host.select('svg');
    this.setDimensions();
    this.setElements();
    this.updateChart();
    console.log(this.svg);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.svg) {
      return;
    } else {
      this.updateChart();
    }
  }

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();

    if (this.dimensions) {
      this.innerWidth =
        this.dimensions.width - this.margins.left - this.margins.right;
      this.innerHeight =
        this.dimensions.height - this.margins.top - this.margins.bottom;
    }

    this.svg.attr('viewBox', [
      0,
      0,
      this.dimensions?.width,
      this.dimensions?.height,
    ]);
  }

  setElements() {
    if (this.innerHeight) {
      this.xAxisContainer = this.svg
        .append('g')
        .attr('class', 'xAxisContainer')
        .attr(
          'transform',
          `translate(${this.margins.left}, ${
            this.margins.top + this.innerHeight
          })`
        );
    }

    this.yAxisContainer = this.svg
      .append('g')
      .attr('class', 'yAxisContainer')
      .attr(
        'transform',
        `translate(${this.margins.left}, ${this.margins.top})`
      );

    if (this.dimensions && this.innerWidth) {
      this.title = this.svg
        .append('g')
        .attr('class', 'titleContainer')
        .attr(
          'transform',
          `translate(${this.margins.left + 0.5 * this.innerWidth}, ${
            this.dimensions?.height - 5
          })`
        )
        .append('text')
        .attr('class', 'label')
        .style('text-anchor', 'middle');
    }

    this.dataContainer = this.svg
      .append('g')
      .attr('class', 'dataContainer')
      .attr(
        'transform',
        `translate(${this.margins.left}, ${this.margins.top})`
      );

    if (this.dimensions) {
      this.legendContainer = this.svg
        .append('g')
        .append('g')
        .attr('class', 'legendContainer')
        .attr(
          'transform',
          `translate(${this.margins.left}, ${
            this.dimensions?.height - 0.5 * this.margins.bottom + 10
          })`
        );
    }
  }

  setParams() {
    // Domains

    const xDomain = [0, Date.now()];
    const yDomain = [0, 100];
    const colorDomain = ['A', 'B', 'C'];
    // Ranges

    const xRange = [0, this.innerWidth];
    const yRange = [this.innerHeight, 0];
    const colorRange = d3.schemeCategory10;

    // Set scales
    this.x = d3.scaleTime().domain(xDomain);
    this.y = d3.scaleLinear();
    this.colors = d3.scaleOrdinal();
  }

  setLabels() {}

  setAxis() {}

  setLegend() {}

  draw() {}

  updateChart() {
    this.setParams();
    this.setLabels();
    this.setAxis();
    this.setLegend();
    this.draw();
  }
}
