// src/app/guards/confirm-leave-guard.ts
import { CanDeactivateFn } from '@angular/router';
import { ContactFormComponent } from '../components/contact-form/contact-form';

export const confirmLeaveGuard: CanDeactivateFn<ContactFormComponent> = (component) => {
  if (component.contactForm.dirty && !component.contactForm.pristine) {
    return confirm(
      'Vous avez des modifications non sauvegardees.\n' +
      'Voulez-vous vraiment quitter?'
    );
  }
  return true;
};
