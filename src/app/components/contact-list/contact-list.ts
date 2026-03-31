import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact';
import { ContactCardComponent } from '../contact-card/contact-card';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, RouterLink, ContactCardComponent],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService); //  The same cache

  contacts = this.contactService.localContacts; // from service cache
  searchTerm = signal('');
  // same logic as before
  loading = this.contactService.loading;
  serviceError = this.contactService.error;

  // computed a signal whose value is automatically recalculated whenever the signals inside it change
  filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.contacts();
    return this.contacts().filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company.name.toLowerCase().includes(term),
    );
  });

  // Runs once when the component loads checks cache
  ngOnInit(): void {
    if (this.contacts().length === 0) {
      this.loadContacts();
    }
  }

  // The component just needs to know if something went wrong
  // cause we already have tap() inside the service already handles putting data into the cache
  loadContacts(): void {
    this.contactService.getAll().subscribe({
      error: (err) => console.error('Erreur:', err),
    });
  }

  // No callbacks needed the service does the work
  deleteContact(id: number): void {
    this.contactService.delete(id).subscribe();
  }

  // Every time the user type something the search term update That triggers filteredContact
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
}
