import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {main} from "@popperjs/core";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  countriesUrl: string = 'http://localhost:8080/api/countries';
  statesUrl: string = 'http://localhost:8080/api/states/';

  constructor(private httpClient: HttpClient) {
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    // build an array for month dropdown list
    // start at desired startMonth and loop until 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    // build an array for Year dropdown list
    // start at desired startYear and loop for next 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl)
      .pipe(
        map(response => response._embedded.countries)
      );
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStatesByCountryCodeUrl = `${this.statesUrl}search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesByCountryCodeUrl)
      .pipe(
        map(response => response._embedded.states)
      );
  }


}

interface GetResponseCountries {
  _embedded: {
    countries: Country[]
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[]
  };
}
