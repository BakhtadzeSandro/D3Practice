import { Component, ElementRef, OnInit } from '@angular/core';
import data from '../../../assets/us-spending-since-2000-v3.json';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss',
})
export class PracticeComponent implements OnInit {
  private data: any[] = data;
  private svg: any;
  private colors: any;
  private margin = 50;
  private width = 700;
  private height = 550;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
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
      .range(['#C45018', '#33DF47', '#AF3A58', '#CBD621']);
  }

  private drawChart(): void {
    const filteredData = this.data.map((item) => ({
      Department: item.Department,
      Spending: +item[this.selectedYear],
    }));

    const totalSpending = d3.sum(filteredData, (d) => d.Spending);

    const pie = d3.pie<any>().value((d: any) => d.Spending);

    this.svg
      .selectAll('pieces')
      .data(pie(filteredData))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(filteredData))
      .enter()
      .append('text')
      .text((d: any) => {
        const percentage =
          ((d.data.Spending / totalSpending) * 100).toFixed(2) + '%';
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
    this.svg.selectAll('*').remove(); // Clear previous chart
    this.drawChart();
  }
}
