import { Component, ElementRef } from '@angular/core';
import data from '../../../assets/us-spending-since-2000-v3.json';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  private data: any[] = data;
  private svg: any;
  private colors: any;
  private margin = 50;
  private width = 500;
  private height = 450;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  tooltipShown = false;
  filteredData: any;
  colorsArray = ['#C45018', '#33DF47', '#AF3A58', '#CBD621'];
  selectedYear: any;
  years: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.years = Object.keys(this.data[0]).filter(
      (key) => key !== 'Department'
    );
    this.selectedYear = this.years[0];
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3
      .select(this.elementRef.nativeElement)
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d.Department))
      .range(this.colorsArray);
  }

  private drawChart(): void {
    this.filteredData = this.data.map((item, index) => ({
      Department: item.Department,
      Spending: +item[this.selectedYear],
      color: this.colorsArray[index],
    }));

    const totalSpending = d3.sum(this.filteredData, (d: any) => d.Spending);

    const pie = d3.pie<any>().value((d: any) => d.Spending);

    this.svg
      .selectAll('pieces')
      .data(pie(this.filteredData))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px')
      .on('mouseover', (event: any, d: any) => {
        const dataOnHover = {
          ...d.data,
          year: this.selectedYear,
          percentage:
            ((d.data.Spending / totalSpending) * 100).toFixed(2) + '%',
        };
        console.log('Mouseover:', dataOnHover, d.data);
        this.setTooltips(event, dataOnHover);
      })
      .on('mouseout', (event: any, d: any) => {});

    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.filteredData))
      .enter()
      .append('text')
      .text((d: any) => {
        const percentage =
          Math.round(
            Number(((d.data.Spending / totalSpending) * 100).toFixed(2))
          ) + '%';
        return percentage;
      })
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 15)
      .style('font-weight', 700)
      .style('font-family', 'monospace');
  }

  updateChart(): void {
    this.svg.selectAll('*').remove();
    this.drawChart();
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
    const expense = d3.format('$,.0f')(+content.Spending);

    tooltip.style('left', `${x}px`).style('top', `${y}px`).html(`
      <p><strong>Year:</strong> ${content.year}</p>
      <p><strong>Department:</strong> ${content.Department}</p>
      <p><strong>Spending:</strong> ${expense}</p>
      <p><strong>Percentage:</strong> ${content.percentage}</p>`);

    d3.select(event.target as any).on('mouseout', () => tooltip.remove());
  }
}
