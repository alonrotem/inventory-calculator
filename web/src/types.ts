import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter } from "@angular/core";
import { DialogClosingReason, ModalDialogComponent } from "./app/components/common/modal-dialog/modal-dialog.component";

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
    color: string;
    created_at: Date; 
    updated_at: Date; 
    created_by: number; 
    updated_by: number;
    allow_shortening_babies_in_pairs: boolean;
    customer_banks: RawMaterialCustomerBank[];
    transaction_record: TransactionRecord | null;
    deleted_bank_records: TransactionRecord[];
}

export interface RawMaterialNameColor {
    id: number;
    name: string;
    color: string;
    allow_shortening_babies_in_pairs: boolean;
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
    quantity_in_kg: number;
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
    knife: number;
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
    knife: number;
    allow_shortening_babies_in_pairs: boolean;
    crown_width: number;
    split_l1: number;
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
    beforeClose(reason: DialogClosingReason): Boolean;
    close: EventEmitter<any>;
}

export interface Stats {
    raw_material_records: number,
    //total_baby_records: number,
    //total_babies: number,
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
    customer_code: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
    order_seq_number: number;
    allow_calculation_advisor?: boolean;

    banks: Customer_Bank[];
    banks_baby_allocations: Customer_Bank_Baby_Allocation[];
    babies: Allocation_Baby[];
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
    raw_material_color: string;
    raw_material_quantity_units: string;
    allow_shortening_babies_in_pairs: boolean;
    pre_save_id: number;
    id: number; 
    customer_id: number;
    raw_material_id: number;
    quantity: number;
    remaining_quantity: number;

    transaction_history: TransactionRecord[];
}

export enum Bank_Allocation_Type {
    babies = "babies",
    tails = "tails"
}

export interface Customer_Bank_Baby_Allocation {
    pre_save_id: number;
    id: number; 
    customer_bank_id: number; 
    quantity: number; 
    remaining_quantity: number;
    allocation_type: Bank_Allocation_Type;

    // For allocations of type "tails" only
    tails_quantity: number;
    tails_in_orders: number;
}

export interface Allocation_Baby {
    id: number;
    allocation_id: number;
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
    allocation_id: number;
		
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
    allocation_id: number;
    allocation_type: Bank_Allocation_Type;
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

//customerHat contains the details of the hat specs the customer ordered
//it holds an array of single hats by those specs, 
//each single hat can have a different kippa, designated customer name and number of wings
export interface CustomerHat {
    id: number;
	hat_material_id: number | null;
	crown_material_id: number| null;
	tails_material_id: number | null;
    wing_quantity: number;
    //adjusted_wings_per_hat: string;
    customer_id: number;
    shorten_top_by: number;
    shorten_crown_by: number;
    wing: Wing | null;
    original_wing_name: string;
    wall_allocation_id: number;
    crown_allocation_id: number;
    tails_allocation_id: number | null;
    tails_overdraft: number;

    crown_visible: number;
    crown_length: number;

    //kippa_size: number;
    mayler_width: number;
    hr_hl_width: number;
    white_hair: boolean;
    white_hair_notes: string;
    order_date: Date | null;
    isurgent: boolean;
    order_notes: string;

    single_hat_orders: Order[];
}

//this is a single hat in the CustomerHat specs
export interface Order {
    id: number;
    customer_order_seq_number: number;
    wing_quantity: number;
    kippa_size: number;
    diameter_inches: number;
    ordering_customer_name: string;
    num_of_hats: number; //defaults to 1, this represents an order of a single hat
    status: OrderStatus;
}

//these details are fetched per hat for the work order screen
export interface OrderDetails {
    id: number;
    hat_id_with_customer: string;
    order_status: Status;
    isurgent: boolean;
    customer_name: string;
    wing_name: string;
    wall_material: string;
    wall_material_color: string;
    kippa_size: number;
    diameter_inches: number;
    wing_quantity: number;
    crown_material: string;
    crown_material_color: string;
    crown_visible: number;
    crown_length: number;
    knife: number;
    white_hair_notes: string;
    white_hair: boolean;
    h_material: string;
    h_material_color: string;
    date: Date;
    //-----
    shorten_top_by: number;
    shorten_crown_by: number;
    tails_overdraft: number;
    mayler_width: number;
    hr_hl_width: number;
    order_notes: string;
    original_order_date: Date | null;

    babies: WingBaby[];
    //-----

/* 
	hat_material_id: number | null;
	crown_material_id: number| null;
	tails_material_id: number | null;
*/    
}

export enum Status {
	new = 'new',
    inline = 'inline',
    shipped = 'shipped',
    onhold = 'onhold',
    completed = 'completed',
    cancelled = 'cancelled'
}

export interface OrderStatus {
    id: number;
    date: Date;
    order_status: Status;
}

//this is for the list of ordered hats
export interface OrderListItem {
    order_id: number;
    customer_hat_id: number;
    hat_id_with_customer: string;
    order_status: Status;
    isurgent: boolean;
    customer_name: string;
    ordering_customer: string;
    wall: string,
    kippa_size: number;
    diameter_inches: number;
    wing_quantity: number;
    adjusted_wings_per_hat: string;
    crown: string,
    crown_visible: number;
    crown_length: number;
    knife: number;
    white_hair_notes: string;
    white_hair: boolean;
    tails: number;
    tails_overdraft: number;
    date: Date;
    order_notes: string;
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
    splt_l1: number;    //split L1 baby to 1-4 parts
    cr_wdt: number;     //crown width
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

export interface SignInData {
    username_or_email: string; 
    password: string; 
    remember: boolean;
    origin_geolocation: string; //lattitude,longitude
    origin_city: string;
	origin_country: string;
    origin_os: string;
    origin_browser: string;
}

export interface RefreshResponse {
  access_token: string;
}
/*
export interface SignInUserInfo {
        hello: string;
        roles: [];
        userId: number;
        username: string;
}
*/

export interface SignInResponse {
    access_token: string; 
    userInfo: BasicUserInfoStatus
}

export interface UserListItem {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  photo_url: string;
  role: string;
  status: string;
  registered_at: Date;
}

export interface UsersList {
    data: UserListItem[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
    };
}

export interface BasicUserInfoStatus {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  photo_url: string;
  roles: nameIdPair[];
  customers: nameIdPair[];
  area_permissions: UserAreaPermissions[];
}

//those are enforced on the server too, but returned to the client for better UX
export interface UserAreaPermissions {
    area: string;
    permissions: string;
}

export interface UserProfile extends BasicUserInfoStatus {
    pending_new_email: string;
    phone: string;
    registered_on: Date;
}

export interface UserDetails extends UserProfile {
    is_verified: boolean;
    is_disabled: boolean;
}

export interface UpdateProfile {
  id: number;
  username?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  new_password: string;
  photo_url: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LoginInfo {
    id: number;
    logged_in_at: Date,
    origin_geolocation: string; //lattitude,longitude
    origin_city: string;
	origin_country: string;
    origin_os: string;
    origin_browser: string;
    origin_ip_address: string;
    is_current_login: boolean;
}

//for a user without an account to send a request
export interface AccountRequestInfo {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  details: string;
}

// to show in the list of account requests
export interface AccountRequestListItem {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  request_date: Date;
  request_status: string;
}

//the actual list of account requests
export interface AccountsRequestList {
    data: AccountRequestListItem[];
    meta: { 
        page: number;
        total_records: number;
        total_pages: number;
        total_babies: number;
    };
}

//get all the details of the request and created user
export interface AccountRequestDetails {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    details: string;
    request_date: Date;
    last_update: Date;
    approved_account_user_id: number;
    approver_user_id: number;
    request_status: string;
    user_firstname: string;
    user_lastname: string;
    user_photo_url: string;
    approver_firstname: string;
    approver_lastnme: string;
    approver_photo_url: string;
    role: nameIdPair;
    customers: nameIdPair[];
    create_new_customer: boolean;
}