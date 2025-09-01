import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = signal<string>('');
  public readonly searchTerm$ = this.searchTerm.asReadonly();

  constructor() { }

  setTerm(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
  }
  
}
