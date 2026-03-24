import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Settings } from '../../services/settings';
import { Transaction } from '../../services/transaction';

@Component({
  selector: 'app-personalize-page',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './personalize-page.html',
  styleUrl: './personalize-page.css',
})
export class PersonalizePage {
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public settingsService: Settings,
    private transactionService: Transaction,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get currency() {
    return this.settingsService.currency;
  }

  set currency(value: string) {
    this.settingsService.currency = value;
  }

  get monthlyBudget() {
    return this.settingsService.monthlyBudget;
  }

  set monthlyBudget(value: number) {
    this.settingsService.monthlyBudget = value;
  }

  newCategory = '';

  addCategory() {
    const name = this.newCategory.trim();

    if (!name) return;

    const exists = this.settingsService.categories.some(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      this.errorMessage = 'Category already exists';
      return;
    }

    this.errorMessage = '';

    const newItem = {
      name: name,
      color: this.generateRandomColor(),
    };

    const categories = this.settingsService.categories;

    const otherIndex = categories.findIndex((c) => c.name === 'Other');

    if (otherIndex === -1) {
      categories.push(newItem);
    } else {
      categories.splice(otherIndex, 0, newItem);
    }

    this.newCategory = '';
    this.settingsService.saveSettings();
  }

  errorMessage = '';

  removeCategory(index: number) {
    const categoryName = this.settingsService.categories[index].name;

    // Don't allow deleting "Other"
    if (categoryName === 'Other') {
      alert('The "Other" category cannot be deleted.');
      return;
    }

    // Move transactions to "Other"
    this.transactionService.expenses.forEach((e) => {
      if (e.category === categoryName) {
        e.category = 'Other';
      }
    });

    // Remove category
    this.settingsService.categories.splice(index, 1);

    // Save updated transactions
    this.transactionService.saveData();
  }

  showSavedMessage = false;

  toastTimeout: any;

  saveSettings() {
    this.settingsService.saveSettings();

    this.showSavedMessage = true;

    // clear previous timeout if user clicks again
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.showSavedMessage = false;
    }, 2000);
  }

  showAddInput = false;

  generateRandomColor(): string {
    const colors = [
      '#4CAF50',
      '#2196F3',
      '#FF9800',
      '#E91E63',
      '#9C27B0',
      '#009688',
      '#FFC107',
      '#3F51B5',
    ];

    const lastColor = this.settingsService.categories.slice(-1)[0]?.color;

    let newColor;

    do {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    } while (newColor === lastColor);

    return newColor;
  }
}
