import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartConfiguration } from 'chart.js';

interface ChartDataItem {
  [key: string]: string | null;
  count: string;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() type: string = '';
  @Input() data: ChartDataItem[] = [];
  @Input() labelProperty: string = 'year'; // The property to use for x-axis labels
  @Input() valueProperty: string = 'count'; // The property to use for values
  @Input() chartTitle: string = 'Number of Records'; // Title for the chart
  @Input() xAxisLabel: string = ''; // Label for x-axis
  @Input() yAxisLabel: string = 'Count'; // Label for y-axis

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: this.chartTitle,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: this.yAxisLabel
        }
      },
      x: {
        title: {
          display: true,
          text: this.xAxisLabel
        }
      }
    },

  };

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['data'] && this.data) ||
      changes['labelProperty'] ||
      changes['valueProperty'] ||
      changes['chartTitle'] ||
      changes['xAxisLabel'] ||
      changes['yAxisLabel']) {
      this.transformData();
      this.updateChartOptions();
    }
  }

  private updateChartOptions() {
    this.barChartOptions = {
      ...this.barChartOptions,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: this.yAxisLabel
          }
        },
        x: {
          title: {
            display: true,
            text: this.xAxisLabel || this.labelProperty
          }
        }
      }
    };
  }

  private transformData() {
    // Filter out null and invalid labels, and sort by label
    const validData = this.data
      .filter(item => item[this.labelProperty] !== null && !isNaN(Number(item[this.valueProperty])))
      .sort((a, b) => {
        const aValue = a[this.labelProperty];
        const bValue = b[this.labelProperty];
        return aValue && bValue ?
          (isNaN(Number(aValue)) ?
            String(aValue).localeCompare(String(bValue)) :
            Number(aValue) - Number(bValue)
          ) : 0;
      });

    // Transform the data
    this.barChartData = {
      labels: validData.map(item => item[this.labelProperty] || 'Null'),
      datasets: [{
        data: validData.map(item => Number(item[this.valueProperty])),
        label: this.chartTitle,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }]
    };
  }
}
