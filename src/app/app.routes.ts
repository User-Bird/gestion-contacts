// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list';
import { ContactDetailComponent } from './components/contact-detail/contact-detail';
import { ContactFormComponent } from './components/contact-form/contact-form';
import { NotFoundComponent } from './components/not-found/not-found';
import { confirmLeaveGuard } from './guards/confirm-leave-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactListComponent },
  {
    path: 'contacts/new',
    component: ContactFormComponent,
    canDeactivate: [confirmLeaveGuard] // <-- GUARD APPLIED HERE
  },
  { path: 'contacts/:id', component: ContactDetailComponent },
  {
    path: 'contacts/:id/edit',
    component: ContactFormComponent,
    canDeactivate: [confirmLeaveGuard] // <-- GUARD APPLIED HERE
  },
  { path: '**', component: NotFoundComponent }
];
