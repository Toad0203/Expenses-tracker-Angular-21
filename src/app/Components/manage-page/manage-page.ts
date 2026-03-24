import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieChart } from '../pie-chart/pie-chart';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Transaction } from '../../services/transaction';
import { Settings } from '../../services/settings';

@Component({
  selector: 'app-manage-page',
  imports: [CommonModule, FormsModule, PieChart],
  templateUrl: './manage-page.html',
  styleUrl: './manage-page.css',
})
export class ManagePage {
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private transactionService: Transaction,
    public settingsService: Settings,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  saveData() {
    if (!this.isBrowser) return;

    localStorage.setItem('expenses', JSON.stringify(this.expenses));
    localStorage.setItem('earnings', JSON.stringify(this.earnings));
  }

  categories = ['Food', 'Transport', 'Education', 'Shopping', 'Health', 'Entertainment', 'Other'];

  get expenses() {
    return this.transactionService.expenses;
  }

  get earnings() {
    return this.transactionService.earnings;
  }

  selectedDate: Date = new Date();
  changeDate(event: any) {
    this.selectedDate = new Date(event.target.value);
  }

  previousDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    this.selectedDate = d;
  }

  nextDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 1);
    this.selectedDate = d;
  }

  getDateLabel(): string {
    return this.selectedDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  get dailyExpenses() {
    return this.expenses.filter(
      (e) => new Date(e.date).toDateString() === this.selectedDate.toDateString(),
    );
  }
  get transactions() {
    const all = [...this.expenses, ...this.earnings];

    const selected = this.selectedDate.toDateString();

    return all
      .filter((t) => new Date(t.date).toDateString() === selected)
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'spend' ? -1 : 1;
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }

  formData = {
    category: '',
    title: '',
    amount: 0,
  };

  submitForm() {
    if (this.editingTransaction) {
      this.editingTransaction.category = this.formData.category;
      this.editingTransaction.title = this.formData.title;
      this.editingTransaction.amount = this.formData.amount;

      // trigger chart update
      if (this.editingTransaction.type === 'spend') {
        this.transactionService.expenses = [...this.expenses];
      }

      this.editingTransaction = null;
    } else {
      const entry = {
        category: this.formData.category,
        title: this.formData.title,
        amount: this.formData.amount,
        type: this.popupType,
        date: new Date(this.selectedDate),
      };

      if (this.popupType === 'spend') {
        this.expenses.push(entry);
        this.transactionService.expenses = [...this.expenses];
        this.transactionService.saveData();
      }

      if (this.popupType === 'earn') {
        this.earnings.push(entry);
        this.transactionService.earnings = [...this.earnings];
        this.transactionService.saveData();
      }
    }

    // reset form
    this.resetForm();

    // close popup
    this.closePopup();
  }

  resetForm() {
    this.formData = {
      category: '',
      title: '',
      amount: 0,
    };
  }

  showPopup = false;
  popupType: 'spend' | 'earn' | null = null;

  openPopup(type: 'spend' | 'earn') {
    this.popupType = type;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupType = null;
  }
  deleteTransaction(transaction: any) {
    if (transaction.type === 'spend') {
      this.transactionService.expenses = this.expenses.filter((e) => e !== transaction);
    }

    if (transaction.type === 'earn') {
      this.transactionService.earnings = this.earnings.filter((e) => e !== transaction);
    }
    this.transactionService.saveData();
  }

  editingTransaction: any = null;
  editTransaction(transaction: any) {
    this.editingTransaction = transaction;

    this.popupType = transaction.type;

    this.formData = {
      category: transaction.category,
      title: transaction.title,
      amount: transaction.amount,
    };

    this.showPopup = true;
    this.transactionService.saveData();
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

  get totalExpenses() {
    return this.expenses
      .filter((e) => new Date(e.date).toDateString() === this.selectedDate.toDateString())
      .reduce((sum, e) => sum + e.amount, 0);
  }
  get totalIncome() {
    return this.earnings
      .filter((e) => new Date(e.date).toDateString() === this.selectedDate.toDateString())
      .reduce((sum, e) => sum + e.amount, 0);
  }
  get balance() {
    return this.totalIncome - this.totalExpenses;
  }

  clearAllTransactions() {
    if (!confirm('Are you sure you want to delete all transactions?')) {
      return;
    }

    this.transactionService.expenses = [];
    this.transactionService.earnings = [];

    localStorage.removeItem('expenses');
    localStorage.removeItem('earnings');
  }

  getCategoryColor(categoryName: string) {
    const category = this.settingsService.categories.find((c) => c.name === categoryName);

    return category ? category.color : '#ccc';
  }
}
