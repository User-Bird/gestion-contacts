// src/app/components/contact-detail/contact-detail.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact';
import { Contact } from '../../models/contact.interface';
import { PhoneFormatPipe } from '../../pipes/phone-format-pipe';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [RouterLink, PhoneFormatPipe],
  templateUrl: './contact-detail.html'
})
export class ContactDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactService = inject(ContactService);

  contact = signal<Contact | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/contacts']);
      return;
    }

    this.contactService.getById(id).subscribe({
      next: (data) => {
        this.contact.set(data);
        this.loading.set(false);
      },
      error: () => this.router.navigate(['/contacts'])
    });
  }

  deleteContact(): void {
    const c = this.contact();
    if (c && confirm(`Supprimer ${c?.name} ?`)) {
      this.contactService.delete(c.id).subscribe({
        next: () => this.router.navigate(['/contacts'])
      });
    }
  }
}
