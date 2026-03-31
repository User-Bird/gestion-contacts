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
    // builds the form
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()x]{7,20}$/)]],
      address: this.fb.group({
        street: ['', Validators.required],
        suite: [''],
        city: ['', Validators.required],
        zipcode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}(-[0-9]{4})?$/)]],
      }),
      company: this.fb.group({
        name: ['', Validators.required],
        catchPhrase: [''],
      }),
    });

    // paramMap.get('id') reads the :id from the URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.contactId = Number(id);
      this.loadContact(this.contactId);
    }
  }

  // check cache before hitting the API
  loadContact(id: number): void {
    const local = this.contactService.localContacts().find((c) => c.id === id);
    if (local) {
      this.contactForm.patchValue(local);
      return;
    }

    this.contactService.getById(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue(contact);
      },
      error: () => this.router.navigate(['/contacts']),
    });
  }

  // Getter
  get f() {
    return this.contactForm.controls;
  }

  // Check if the form is invalid
  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.submitted = true; // ← mark as submitted before navigating The guard check this
    const data = this.contactForm.value; //  extracts the current form data as a plain object

    // Edit mode → call update()
    //Create mode → call create()
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
  }

  // submitted stay false in onCancel so the guard warn the user
  onCancel(): void {
    this.router.navigate(['/contacts']);
  }
}
