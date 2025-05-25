import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter } from "@angular/core";
import { ModalDialogComponent } from "./app/components/common/modal-dialog/modal-dialog.component";

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
    name: string;
    purchased_at: Date;
    purchase_quantity: number;
    remaining_quantity: number; 
    quantity_units: string; 
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
    transaction_record: TransactionRecord | null;
    deleted_bank_records: TransactionRecord[];
}

export interface RawMaterialCustomerBank {
    id: number;
    name: string;
    business_name: string;
    raw_material_id: number;
    customer_id: number;
    quantity: number;
    remaining_quantity: number;
    quantity_units: string;
    transaction_record: TransactionRecord | null;
}

export interface CustomerBanksBabies {
	id: number;
    customer_bank_id: number;
	quantity: number;
    remaining_quantity: number;
    transaction_record: TransactionRecord | null;
}

export interface Baby {
    id: number;
    raw_material_parent_id: number;
    raw_material: string;
    length: number;
    quantity: number;
    quantity_in_pending_orders: number;
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
    customer_id: number;
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
    id: number;
    wing_id: number;
    length: number;
    position: string;
}
/*
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
    photo: string;
    wings: HatWing[];
}

export interface HatBasicInfo {
    // the hat
    hat_id: number;
    hat_name: string;
    hat_material: string; 
    crown_material: string;
    photo: string;
    // the wing
    wing_id: number; 
    wing_name: string;
    wing_quantity:number;
}
*/
export interface CustomerHat {
    id: number;
	hat_material: string;
	crown_material: string;
    wing_quantity: number;
    customer_id: number;
    shorten_top_by: number;
    shorten_crown_by: number;
    wing: Wing | null;
    wall_allocation_id: number;
    crown_allocation_id: number;
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


export interface ModalDialog {
    dialogWrapper: ModalDialogComponent | null;
    editedObject: any | null;
    onOpen(): any;
    beforeClose(): Boolean;
    close: EventEmitter<any>;
}

export interface Stats {
    raw_material_records: number,
    total_baby_records: number,
    total_babies: number,
    total_wings: number,
    num_of_orders: number,
    total_hats: number,
    cur_raw_material_quantity_kg: number,
    cur_raw_material_remaining_kg: number,
    cur_raw_material_quantity_units: number,
    cur_raw_material_remaining_units: number
}

export interface QuantityHistoryRecord {
    id: number,
    date: Date,
    transaction_quantity: number,
    transaction_type: TransactionType,
    cumulative_amount: number
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
    banks_baby_allocations: Customer_Bank_Baby_Allocation[];
    babies: Customer_Baby[];
}

export interface CustomerListItem {
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
    bank_count: number;
    allocation_count: number;
}

export interface Customer_Bank {
    raw_material_name: string; 
    raw_material_quantity_units: string;
    id: number; 
    customer_id: number;
    raw_material_id: number;
    quantity: number;
    remaining_quantity: number;

    transaction_history: TransactionRecord[];
}

export interface Customer_Bank_Baby_Allocation {
    id: number; 
    customer_bank_id: number; 
    quantity: number; 
    remaining_quantity: number; 
}

export interface Customer_Baby {
    id: number;
    customer_banks_babies_id: number;
    length: number;
    quantity: number;
    quantity_in_pending_orders: number;
    
    /*
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
    */
}

export interface Customers {
    data: CustomerListItem[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    };
}

export enum TransactionType {
    raw_material_purchase = "raw_material_purchase",
    to_customer_bank = "to_customer_bank",
    customer_bank_allocate_to_Work = "customer_bank_allocate_to_Work",
    customer_bank_allocation_deleted = "customer_bank_allocation_deleted",
    deleted_customer_bank = "deleted_customer_bank"
}

// for saving action transactions
export interface TransactionRecord {
	id: number;
    date: Date;
    added_by: number;
    transaction_quantity: number;
    transaction_type: TransactionType;
    
    // involved banks in this transaction:
	raw_material_id: number;
    customer_id: number;
    customer_bank_id: number;
    customer_banks_babies_id: number;
		
	// track keeping on quantities at the time of this transaction:
    cur_raw_material_quantity: number;
    cur_customer_bank_quantity: number;
    cur_banks_babies_allocation_quantity: number;
}

//for history record reports
export interface HistoryReportRecord {
    id: number;
    
    raw_material_name: string;
    customer_name: string;
    transaction_type: TransactionType; 
    
    transaction_quantity: number;
    raw_material_id: number;
    customer_id: number;
    customer_bank_id: number;
    customer_banks_babies_id: number;
    cur_raw_material_quantity: number;
    cur_customer_bank_quantity: number;
    cur_banks_babies_allocation_quantity: number;

    date: Date;
    added_by: number;
}

export interface nameIdPair {
    name: string;
    id: number;
}

export interface Order {
    id: number;
    customer_hat: CustomerHat;
    num_of_hats: number;
    status: OrderStatus;
}

export enum Status {
    new = "new",
    updated = "updated",
    processing = "processing",
    completed = "completed",
    cancelled = "cancelled",
    deleted = "deleted",
}

export interface OrderStatus {
    id: number;
    date: Date;
    order_status: Status;
}

export interface OrderListItem {
    id: number;
    customer_name: string;
    num_of_hats: number;
    wing_quantity: number;
    order_status: Status
    date: Date;
}

export interface OrdersList {
    data: OrderListItem[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    };
}

//this is used to receive information of all wings and babies in the sytesm
//for calculations and suggestions to the user
//properties are shortened by name to reduce traffic
export interface ShortWingsInfo {
    w_id: number;       //wing id
    w_n: string;        //wing name
    b_id: number;       //baby id
    p: string;          //baby position
    l: number;          //baby length
}

export interface OrderAdvisorHatsSuggestion {
    wing_id: number;
    wing_name: string;
    num_of_wings_per_hat: number;
    max_num_of_hats: number;
    alternatives: OrderAdvisorHatsSuggestionAlternative[];
}

export interface OrderAdvisorHatsSuggestionAlternative {
    shorten_top: number;
    shorten_crown: number;
    max_num_of_hats: number;
    descriptive_string: string;
}

export interface OrderAdvisorWingOverall {
    wing_suggestions: OrderAdvisorHatsSuggestion[];
    max_num_of_hats: number;
    max_hat_wing_name: string;
    max_hat_wing_id: number;
    wall_allocation_id: number;
    crown_allocation_id: number;
}

export interface LogfileListItem {
    filename: string;
    size: number;
    date: Date;
}