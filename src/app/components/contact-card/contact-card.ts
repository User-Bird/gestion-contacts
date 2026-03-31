// src/app/components/contact-card/contact-card.ts
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../models/contact.interface';

@Component({
  selector: 'app-contact-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <div class="avatar">{{ initials() }}</div>
      <div class="info">
        <h3>{{ contact().name }}</h3>
        <p class="email">{{ contact().email }}</p>
        <p class="company">{{ contact().company.name }}</p>
      </div>
      <div class="actions">
        <a [routerLink]="['/contacts', contact().id]" class="btn-view">Voir</a>
        <a [routerLink]="['/contacts', contact().id, 'edit']" class="btn-edit">Modifier</a>
        <button (click)="onDelete()" class="btn-delete">Supprimer</button>
      </div>
    </div>
  `
})
export class ContactCardComponent {
  // input() receives data from the parent component
  contact = input.required<Contact>();

  // output() sends events back up to the parent component
  deleted = output<number>();

  initials() {
    return this.contact().name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  onDelete() {
    if (confirm(`Supprimer ${this.contact().name} ?`)) {
      this.deleted.emit(this.contact().id);
    }
  }
}
