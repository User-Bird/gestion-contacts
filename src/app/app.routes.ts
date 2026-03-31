// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list';
import { ContactDetailComponent } from './components/contact-detail/contact-detail';
import { ContactFormComponent } from './components/contact-form/contact-form';
import { NotFoundComponent } from './components/not-found/not-found';
import { confirmLeaveGuard } from './guards/confirm-leave-guard';

// this file decide wht The component Angular should render
export const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' }, // if empty go to /contacts nothing more
  { path: 'contacts', component: ContactListComponent },
  {
    path: 'contacts/new',
    component: ContactFormComponent,
    canDeactivate: [confirmLeaveGuard],
  },
  { path: 'contacts/:id', component: ContactDetailComponent }, // :id URL parameter a placeholder
  {
    path: 'contacts/:id/edit',
    component: ContactFormComponent,
    canDeactivate: [confirmLeaveGuard],
  },
  { path: '**', component: NotFoundComponent },
];
