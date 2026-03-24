// src/app/components/contact-list/contact-list.ts
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact';
import { ContactCardComponent } from '../contact-card/contact-card';
import { Contact } from '../../models/contact.interface';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, RouterLink, ContactCardComponent],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);

  contacts = signal<Contact[]>([]);
  searchTerm = signal('');
  loading = this.contactService.loading;
  serviceError = this.contactService.error;

  filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.contacts();
    return this.contacts().filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.company.name.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getAll().subscribe({
      next: (data) => this.contacts.set(data),
      error: (err) => console.error('Erreur:', err)
    });
  }

  deleteContact(id: number): void {
    this.contactService.delete(id).subscribe({
      next: () => {
        this.contacts.update(list => list.filter(c => c.id !== id))
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
}
