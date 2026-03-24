import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Settings } from '../../services/settings';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css',
})
export class PieChart implements OnInit, OnChanges {
  constructor(private settingsService: Settings) {}

  @Input() expenses: any[] = [];
  public chart: any;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chart) return;

    if (changes['expenses']) {
      this.updateChart();
    }
  }

  categoryColors: any = {
    Food: '#FF9800',
    Transport: '#2196F3',
    Education: '#9C27B0',
    Shopping: '#E91E63',
    Health: '#4CAF50',
    Entertainment: '#FFC107',
    Other: '#607D8B',
  };

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const categoryTotals: any = {};

    this.expenses.forEach((exp) => {
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const chartData = data.length ? data : [1];
    const chartLabels = labels.length ? labels : ['No Expenses'];

    const categoryColors = labels.map((label) => {
      const category = this.settingsService.categories.find((c) => c.name === label);

      return category ? category.color : '#cccccc';
    });

    this.chart = new Chart('MyChart', {
      type: 'doughnut',
      plugins: [ChartDataLabels],

      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartData,
            backgroundColor: categoryColors,
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },

      options: {
        layout: {
          padding: {
            top: 30,
            bottom: 30,
            left: 50,
            right: 50,
          },
        },
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            // position: 'bottom',
            display: false,
          },
          datalabels: {
            color: '#333',

            anchor: 'end',
            align: 'end',
            offset: 15,

            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#ffffff',
            borderRadius: 4,
            padding: 6,

            font: {
              weight: 'bold',
              size: 10,
            },

            formatter: (value: number, context: any) => {
              const label = context.chart.data.labels[context.dataIndex];

              const data = context.chart.data.datasets[0].data;
              const total = data.reduce((a: number, b: number) => a + b, 0);

              const percentage = ((value / total) * 100).toFixed(1);

              return `${label}\n${percentage}%`;
            },
          },
        },
      },
    });
  }

  updateChart() {
    if (!this.chart) return;

    const categoryTotals: any = {};

    this.expenses.forEach((exp) => {
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += exp.amount;
    });

    let labels = Object.keys(categoryTotals);
    let data = Object.values(categoryTotals);
    const colors = labels.map((label) => this.categoryColors[label] || '#999999');

    // fallback when empty
    if (data.length === 0) {
      labels = ['No expenses'];
      data = [1];
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = colors;

    this.chart.update();
  }
}
