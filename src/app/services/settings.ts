import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Settings {
  currency = '₹';
  monthlyBudget = 0;

  categories: { name: string; color: string }[] = [
    { name: 'Food', color: '#4CAF50' },
    { name: 'Transport', color: '#2196F3' },
    { name: 'Shopping', color: '#9C27B0' },
    { name: 'Education', color: '#FF9800' },
    { name: 'Entertainment', color: '#E91E63' },
    { name: 'Other', color: '#9E9E9E' },
  ];

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.loadSettings();
    }
  }

  loadSettings() {
    const currency = localStorage.getItem('currency');
    const budget = localStorage.getItem('monthlyBudget');
    const categories = localStorage.getItem('categories');

    if (currency) this.currency = currency;
    if (budget) this.monthlyBudget = Number(budget);
    if (categories) this.categories = JSON.parse(categories);
  }

  saveSettings() {
    if (!this.isBrowser) return;

    localStorage.setItem('currency', this.currency);
    localStorage.setItem('monthlyBudget', String(this.monthlyBudget));
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }
}
