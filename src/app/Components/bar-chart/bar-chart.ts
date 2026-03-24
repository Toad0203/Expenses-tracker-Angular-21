import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart implements OnChanges {
  @Input() expenses: any[] = [];
  @Input() earnings: any[] = [];
  @Input() selectedMonth!: Date;

  chart: any;

  ngOnChanges(changes: SimpleChanges) {
    this.refreshChart();
  }

  getMonthlyDailyData() {
    const daysInMonth = new Date(
      this.selectedMonth.getFullYear(),
      this.selectedMonth.getMonth() + 1,
      0,
    ).getDate();

    const expensesPerDay = new Array(daysInMonth).fill(0);
    const earningsPerDay = new Array(daysInMonth).fill(0);

    this.expenses.forEach((e) => {
      const d = new Date(e.date);

      if (
        d.getMonth() === this.selectedMonth.getMonth() &&
        d.getFullYear() === this.selectedMonth.getFullYear()
      ) {
        expensesPerDay[d.getDate() - 1] += e.amount;
      }
    });

    this.earnings.forEach((e) => {
      const d = new Date(e.date);

      if (
        d.getMonth() === this.selectedMonth.getMonth() &&
        d.getFullYear() === this.selectedMonth.getFullYear()
      ) {
        earningsPerDay[d.getDate() - 1] += e.amount;
      }
    });

    return { expensesPerDay, earningsPerDay };
  }

  refreshChart() {
    if (!this.selectedMonth) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const data = this.getMonthlyDailyData();
    const activeDays = data.expensesPerDay.map((v, i) => v > 0 || data.earningsPerDay[i] > 0);

    const labels = Array.from({ length: data.expensesPerDay.length }, (_, i) => i + 1);

    this.chart = new Chart('monthlyChart', {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [
          {
            label: 'Expenses',
            data: data.expensesPerDay,
            backgroundColor: '#E53935',
            barThickness: 10,
            borderRadius: 4,
            maxBarThickness: 20,
          },
          {
            label: 'Earnings',
            data: data.earningsPerDay,
            backgroundColor: '#4CAF50',
            barThickness: 10,
            borderRadius: 4,
            maxBarThickness: 20,
          },
        ],
      },

      options: {
        layout: {
          padding: {
            top: 20,
            bottom: -10,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: (context: any) => {
                const index = context.index;
                return activeDays[index] ? '#444' : '#bbb';
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
            },
          },
          datalabels: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
