import { Injectable } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Transaction {
  expenses: any[] = [];
  earnings: any[] = [];

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.loadData();
    }
  }

  loadData() {
    const savedExpenses = localStorage.getItem('expenses');
    const savedEarnings = localStorage.getItem('earnings');

    if (savedExpenses) {
      this.expenses = JSON.parse(savedExpenses);
    }

    if (savedEarnings) {
      this.earnings = JSON.parse(savedEarnings);
    }
  }

  saveData() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
    localStorage.setItem('earnings', JSON.stringify(this.earnings));
  }
}
