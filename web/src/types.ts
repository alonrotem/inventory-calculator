import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter } from "@angular/core";

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
        total_babies: number;
    };
}

export interface Babies {
    data: Baby[];
    meta: { 
        page: number;
        total_records: number;
        sum_quantity: number;
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
    customer_banks: RawMaterialCustomerBank[];
}

export interface RawMaterialCustomerBank {
    id: number;
    name: string;
    business_name: string;
    raw_material_id: number;
    customer_id: number;
    weight: number;
    units: number;
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

export interface WingsListItem {
    id: number;
    width: number;
    name: string;
    Left: number;
    Top: number;
    Right: number;
    Crown: number;
}

export interface WingsList {
    data: WingsListItem[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    }
}

export interface Wing {
    id: number;
    name: string;
    width: number;
    babies: WingBaby[];
}

export interface WingBaby{
    /*id: number;*/
    wing_id: number;
    length: number;
    position: string;
}

export interface WingPosition {
    id: number;
    name: string;
}

export interface HatListItem {
    id: number;
    name: string;
    total_wings: number;
    hat_material: string;
    crown_material: string;
}

export interface HatsList {
    data: HatListItem[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    }
}

export interface Hat {
    id: number;
    name: string;
    hat_material: string;
    crown_material: string;
    wings: HatWing[];
}

export interface HatWing {
    id: number;
    parent_hat_id: number; 
    wing_name: string; 
    wing_quantity: number;
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
    onOpen(): any;
    beforeClose(): Boolean;
    close: EventEmitter<any>;
}

export interface Stats {
    raw_material_records: number,
    total_baby_records: number,
    total_babies: number,
    total_wings: number,
    total_hats: number
}

export class Point {
    x:number;
    y:number;
    constructor(x:number, y:number) {
      this.x = x;
      this.y = y;
    }
  }

  export interface Customer {
    id: number;
    name: string;
    business_name: string;
    email: string; 
    phone: string; 
    tax_id: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;

    banks: Customer_Bank[];
    babies: Customer_Baby[];
}

export interface Customer_Bank {
    bank_id: number;
    customer_id: number;
    raw_material_id: number;
    weight: number;
    units: number;
    raw_material_name: string;
    customer_name: string;
}

export interface Customer_Baby {
    id: number;
    customer_bank_id: number;
    length: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
    customer_id: number;
    material_name: string;
    customer_name: string;
}

export interface Customers {
    data: Customer[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    };
}