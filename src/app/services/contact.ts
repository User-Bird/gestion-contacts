import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { Contact } from '../models/contact.interface';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  loading = signal(false);
  error = signal<string | null>(null);

  private _localContacts = signal<Contact[]>([]);
  localContacts = this._localContacts.asReadonly();

  getAll(): Observable<Contact[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap((data) => {
        this._localContacts.set(data);
        this.loading.set(false);
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  getById(id: number): Observable<Contact> {
    this.loading.set(true);
    return this.http.get<Contact>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => this.handleError(err)),
    );
  }

  create(contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact).pipe(
      tap((newContact) => {
        console.log('ADDING TO LIST:', newContact);
        this._localContacts.update((list) => [...list, newContact]);
      }),
      catchError((err) => this.handleError(err)),
    );


  }

  update(id: number, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact).pipe(
      tap((updated) => {
        this._localContacts.update((list) =>
          list.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        );
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._localContacts.update((list) => list.filter((c) => c.id !== id));
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loading.set(false);
    let message = 'Une erreur est survenue';
    if (error.status === 0) message = 'Impossible de contacter le serveur';
    else if (error.status === 404) message = 'Contact non trouvé';
    else if (error.status === 500) message = 'Erreur interne du serveur';
    this.error.set(message);
    return throwError(() => new Error(message));
  }
}
