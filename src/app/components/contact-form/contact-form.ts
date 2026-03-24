// src/app/components/contact-form/contact-form.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);

  contactForm!: FormGroup;
  isEditMode = false;
  contactId: number | null = null;
  submitted = false;

  ngOnInit(): void {
    // Construire le formulaire avec FormBuilder
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{8,15}$/)]],
      address: this.fb.group({
        street: ['', Validators.required],
        suite: [''],
        city: ['', Validators.required],
        zipcode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      }),
      company: this.fb.group({
        name: ['', Validators.required],
        catchPhrase: [''],
      }),
    });

    // Mode edition charger le contact
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.contactId = Number(id); // Fixed the PDF's type error here
      this.loadContact(this.contactId);
    }
  }

  loadContact(id: number): void {
    this.contactService.getById(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue(contact);
      },
      error: () => this.router.navigate(['/contacts']),
    });
  }

  // Getter pour acceder facilement aux champs
  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.submitted = true; // ← mark as submitted before navigating
    const data = this.contactForm.value;
    if (this.isEditMode && this.contactId) {
      const id = this.contactId;
      this.contactService.update(id, data).subscribe({
        next: () => this.router.navigate(['/contacts']),
      });
    } else {
      this.contactService.create(data).subscribe({
        next: () => this.router.navigate(['/contacts']),
      });
    }
    this.contactService.create(data).subscribe({
      next: (result) => {
        console.log('CREATED:', result); // add this
        this.router.navigate(['/contacts']);
      },
      error: (err) => console.log('ERROR:', err), // add this
    });
  }

  onCancel(): void {
    this.router.navigate(['/contacts']);
  }
}
