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

export interface Babies {
    data: Baby[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    };
}

export interface RawMaterial {
    id: number;
    name: String;
    purchased_at: Date;
    weight: number;
    units: number;
    units_per_kg: number;
    vendor_name: string;
    origin_country: string;
    price: number;
    currency: string;
    notes: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
    babies_quantity: number;
    babies: Baby[];
}


export interface Baby {
    id: number;
    raw_material_parent_id: number;
    raw_material: string;
    length: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}

export interface PaginationParams {
    [key:string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    page: number;
    perPage: number;
}

export interface Country {
    code: string;
    name: string;
    order: number;
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
    order: number;
}

export interface ModalObjectEditor {
    editedObject: any;
    beforeClose(): Boolean;
}