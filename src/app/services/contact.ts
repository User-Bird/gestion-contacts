import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

//RxJS is a library for handling async operations
// tap  peek at the data as it flows through do something with it but dont change it

import { Observable, catchError, throwError, tap } from 'rxjs';
import { Contact } from '../models/contact.interface';

// singleton create one single instance of this service for the whole app
// Every component that asks for ContactService gets the exact same object
@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  // for chargement When a request starts it becomes true
  loading = signal(false);
  //for "Contact non trouvé"
  error = signal<string | null>(null);

  // writable. Only this service can change it
  private _localContacts = signal<Contact[]>([]);
  // read-only This is what components get
  localContacts = this._localContacts.asReadonly();

  getAll(): Observable<Contact[]> {
    this.loading.set(true);
    this.error.set(null);
    // make the GET request when data arrives run this tap it sets the cache
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap((data) => {
        this._localContacts.set(data); // ALL 10 contacts go in here
        this.loading.set(false);
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  // Same idea but for a single contact by ID note dosnt update cache
  getById(id: number): Observable<Contact> {
    this.loading.set(true);
    return this.http.get<Contact>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => this.handleError(err)),
    );
  }

  //the form might not fill every field Partial<Contact>
  // update signals that hold arrays you never mutate the existing array you always return a new one "this mean??"
  create(contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact).pipe(
      tap((newContact) => {
        console.log('ADDING TO LIST:', newContact);
        this._localContacts.update((list) => [...list, newContact]);
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  // loop through all contacts and merge old contact with new data
  update(id: number, contact: Partial<Contact>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact).pipe(
      tap(() => {
        // ← ignore the API response, use contact directly
        this._localContacts.update((list) =>
          list.map((c) => (c.id === id ? { ...c, ...contact } : c)),
        );
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  // update the cache by keeping every contact whose id is not the one we deleted
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._localContacts.update((list) => list.filter((c) => c.id !== id));
      }),
      catchError((err) => this.handleError(err)),
    );
  }

  // Called whenever any request fails
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
