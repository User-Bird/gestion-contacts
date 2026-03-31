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
  `,
})
export class ContactCardComponent {
  // input() receives data from the parent component
  contact = input.required<Contact>();

  // output() sends events back up to the parent component
  // A delete event sent back up to the list when the user clicks delete
  deleted = output<number>();

  initials() {
    return this.contact()
      .name.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  // this component never touches the service directly. It doesn't know what happens after it emits
  //  It just says "I want this deleted" and lets the parent handle it
  onDelete() {
    if (confirm(`Supprimer ${this.contact().name} ?`)) {
      this.deleted.emit(this.contact().id);
    }
  }
}


// ContactListComponent
//   │
//   │  passes contact object DOWN via [contact]
//   │
// ContactCardComponent
//   │
//   │  sends id UP via (deleted) when user confirms delete
//   │
// ContactListComponent.deleteContact(id)
//   │
//   │  calls service
//   │
// ContactService.delete(id) → cache updates → list rerenders
