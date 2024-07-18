import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { Coffee } from "../common/coffee-model";
import { Observable } from 'rxjs';

/// JOHN this is the file

@Injectable({
  providedIn: 'root'
})
export class CoffeeHttpService {

	private headers = {
		Accept: 'application/json',
		'Cache-Control': 'no-cache',
		'Content-Type': 'application/json',
	};

  constructor(private client: HttpClient) {}

	getAllCoffees(): Observable<Coffee[]>{

		return this.client
			.get<Coffee[]>(`${environment.restClientUrl}/coffees`);
	}

	getCoffeeById(id: number): Observable<Coffee>{

		return this.client
			.get<Coffee>(`${environment.restClientUrl}/coffees/${id}`)
	}

	addNewCoffee(coffee: Coffee): Observable<Coffee> {

		return this.client
			.post<Coffee>(
				`${environment.restClientUrl}/coffees`,
				JSON.stringify(coffee),
				{ headers: this.headers }
			)
	}

	updateCoffee(toUpdate: Coffee): Observable<Coffee>{

		return this.client.put<Coffee>(
			`${environment.restClientUrl}/coffees/${toUpdate.id}`,
			JSON.stringify(toUpdate),
			{ headers: this.headers }
		)
	}

	deleteCoffee(id: number): Observable<void>{

		return this.client
			.delete<void>(`${environment.restClientUrl}/coffees/${id}`)
	}

}
