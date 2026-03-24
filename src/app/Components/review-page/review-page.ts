import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Transaction } from '../../services/transaction';
import { BarChart } from '../bar-chart/bar-chart';

@Component({
  selector: 'app-review-page',
  imports: [NgFor, BarChart],
  templateUrl: './review-page.html',
  styleUrl: './review-page.css',
})
export class ReviewPage {
  constructor(private transactionService: Transaction) {}

  get expenses() {
    return this.transactionService.expenses;
  }

  get earnings() {
    return this.transactionService.earnings;
  }

  selectedMonth: Date = new Date();
  previousMonth() {
    const d = new Date(this.selectedMonth);
    d.setMonth(d.getMonth() - 1);
    this.selectedMonth = d;
  }

  nextMonth() {
    const d = new Date(this.selectedMonth);
    d.setMonth(d.getMonth() + 1);
    this.selectedMonth = d;
  }
  getMonthLabel(): string {
    return this.selectedMonth.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  }

  get monthlyExpenses() {
    return this.transactionService.expenses
      .filter((e) => {
        const d = new Date(e.date);
        return (
          d.getMonth() === this.selectedMonth.getMonth() &&
          d.getFullYear() === this.selectedMonth.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }
  get monthlyIncome() {
    return this.transactionService.earnings
      .filter((e) => {
        const d = new Date(e.date);
        return (
          d.getMonth() === this.selectedMonth.getMonth() &&
          d.getFullYear() === this.selectedMonth.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }
  get monthlyBalance() {
    return this.monthlyIncome - this.monthlyExpenses;
  }

  get categoryExpenses() {
    const totals: any = {};

    const monthlyExpenses = this.expenses.filter((e) => {
      const d = new Date(e.date);

      return (
        d.getMonth() === this.selectedMonth.getMonth() &&
        d.getFullYear() === this.selectedMonth.getFullYear()
      );
    });

    monthlyExpenses.forEach((e) => {
      if (!totals[e.category]) {
        totals[e.category] = 0;
      }

      totals[e.category] += e.amount;
    });

    let categories = Object.keys(totals)
      .map((category) => ({
        category,
        amount: totals[category],
        percent: 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0);

    categories.forEach((c) => {
      c.percent = totalSpent ? (c.amount / totalSpent) * 100 : 0;
    });

    if (categories.length > 5) {
      const top = categories.slice(0, 5);
      const rest = categories.slice(5);

      const otherTotal = rest.reduce((sum, c) => sum + c.amount, 0);

      top.push({
        category: 'Other',
        amount: otherTotal,
        percent: totalSpent ? (otherTotal / totalSpent) * 100 : 0,
      });

      categories = top;
    }

    return categories;
  }
}
