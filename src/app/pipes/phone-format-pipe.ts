// src/app/pipes/phone-format-pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Nettoyer le numero
    const cleaned = value.replace(/\D/g, '');

    // Formater 06 12 34 56 78
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }

    return value; // Retourner tel quel si format inconnu
  }
}
