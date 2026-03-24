// src/app/services/contact.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Contact } from '../models/contact.interface';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // Signaux pour l'état global
  loading = signal(false);
  error = signal<string | null>(null);

  // GET: Récupérer tous les contacts
  getAll(): Observable<Contact[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => this.handleError(err))
    );
  }

  // GET: Récupérer un contact par ID
  getById(id: number): Observable<Contact> {
    this.loading.set(true);
    return this.http.get<Contact>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError(err => this.handleError(err))
    );
  }

  // POST: Créer un contact
  create(contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // PUT: Modifier un contact
  update(id: number, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // DELETE: Supprimer un contact
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loading.set(false);
    let message = 'Une erreur est survenue';

    if (error.status === 0) {
      message = 'Impossible de contacter le serveur';
    } else if (error.status === 404) {
      message = 'Contact non trouvé';
    } else if (error.status === 500) {
      message = 'Erreur interne du serveur';
    }

    this.error.set(message);
    return throwError(() => new Error(message));
  }
}
