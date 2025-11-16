import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonSpecies } from '../utils/game-type';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`);
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${name.toLowerCase()}`);
  }

  getPokemonSpecies(id: number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.baseUrl}/pokemon-species/${id}`);
  }

  getRandomPokemon(minId: number, maxId: number): Observable<Pokemon> {
    const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    return this.getPokemon(randomId);
  }
}
