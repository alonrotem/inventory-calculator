import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { lastValueFrom, Observable, of } from 'rxjs';
import { PaginationParams, Wing, ShortWingsInfo, WingsList, WingsListItem, WingBaby,  } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WingsService {

  allWingsAndBabiesCache: ShortWingsInfo[] = [];

  constructor(private apiService: ApiService) { }

  getWing = (id: number): Observable<Wing> => {
    return this.apiService.get(`${environment.serverUrl}/wings/${id}`, {
      responseType: 'json'
    });
  };

  getWingByName = (name: string): Observable<Wing> => {
    return this.apiService.get(`${environment.serverUrl}/wings/names/${name}`, {
      responseType: 'json'
    });
  };

  getWings = (params: PaginationParams): Observable<WingsList> => {
    return this.apiService.get(`${environment.serverUrl}/wings/`, {
      params,
      responseType: 'json'
    });
  };

  getWings_for_customer = (customerID: number): Observable<WingsList> => {
    return this.apiService.get(`${environment.serverUrl}/wings/customer/${customerID}`, {
      responseType: 'json'
    });
  };
/*
  getWingPositions = (): Observable<WingPosition[]> => {
    return this.apiService.get(`${environment.serverUrl}/wings/positions`, {
      responseType: 'json'
    });
  };
*/  getWingsNames = (): Observable<string[]> => {
      return this.apiService.get(`${environment.serverUrl}/wings/names`, {
        responseType: 'json'
      });
    };
/*
  saveNewWing = (wing: Wing): Observable<any> => {
    return this.apiService.post(`${environment.serverUrl}/wings/`, wing, { });
  };
*/
  saveWing = (wing: Wing): Observable<any> => {
    this.invalidateWingsCache();
    return this.apiService.put(`${environment.serverUrl}/wings/`, wing, { });
  };

  deleteWing = (id: number): Observable<any> => {
    this.invalidateWingsCache();
    return this.apiService.delete(`${environment.serverUrl}/wings/${id}`, { });
  };

   getAllNonCustomerWingsAndBabies = (wing_id_filter: number=0): Observable<ShortWingsInfo[]> => {
    return this.apiService.get(`${environment.serverUrl}/wings/allwingsandbabies/${wing_id_filter}`, { responseType: 'json' }) as Observable<ShortWingsInfo[]>;
    /*
    let wing_data: ShortWingsInfo[] = [];
    if(this.allWingsAndBabiesCache.length == 0) {
      let request_observable = this.apiService.get(`${environment.serverUrl}/wings/allwingsandbabies/0`, { responseType: 'json' }) as Observable<ShortWingsInfo[]>;
      request_observable.subscribe(
      {
        next: (data: ShortWingsInfo[]) => {
          this.allWingsAndBabiesCache = data;
          if(wing_id_filter) {
            wing_data = this.allWingsAndBabiesCache.filter(w => w.w_id == wing_id_filter);
          }
          else {
            wing_data = data;
          }
          return of(wing_data);
        },
        error: (error) => {
          console.log(error);
        }
      });
      //return request_observable;
    }
    return of(wing_data);
    */
  }

  sort_babies(items: WingBaby[], reversed: boolean = false): WingBaby[] {
    // ✅ Create a copy first - this prevents mutation of the original array
    return [...items].sort((a, b) => {
        const parsePosition = (pos: string): { prefix: string; number: number } => {
            if (pos.toUpperCase() === 'TOP') {
                return { prefix: 'TOP', number: 0 };
            }

            const match = pos.match(/^([CLR])(\d+)$/i);
            if (!match) {
                throw new Error(`Invalid position format: ${pos}`);
            }

            return {
                prefix: match[1].toUpperCase(),
                number: parseInt(match[2], 10)
            };
        };

        const prefixOrder = ['TOP', 'C', 'L', 'R'];

        const aParsed = parsePosition(a.position);
        const bParsed = parsePosition(b.position);

        const aPrefixIndex = prefixOrder.indexOf(aParsed.prefix);
        const bPrefixIndex = prefixOrder.indexOf(bParsed.prefix);

        if (aPrefixIndex !== bPrefixIndex) {
            return aPrefixIndex - bPrefixIndex;
        }

        return (reversed) ? (bParsed.number - aParsed.number) : (aParsed.number - bParsed.number);
    });
  }

  invalidateWingsCache() {
    this.allWingsAndBabiesCache = [];
  }
}
