import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}

export interface RawMaterials {
    data: RawMaterial[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    };
}

    /*
export interface RawMaterial {
    id: number;
    type: Text;
    weight: number;
    date_of_purchase: Date;

-	Type (text autocomplete)
-	Weight (number kg)
-	Babies --> Data type: Baby
-	Date
*/

export interface RawMaterial {
    id: number;
    name: String;
    purchased_at: Date;
    weight: number;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface PaginationParams {
    [key:string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    page: number;
    perPage: number;
}