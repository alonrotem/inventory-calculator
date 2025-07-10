import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { OrdersService } from '../../../services/orders.service';
import { firstValueFrom } from 'rxjs';
import { OrderDetails, Status } from '../../../../types';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DateStrPipe } from "../../../utils/pipes/date_pipe";
import { NgFor } from '@angular/common';
import { SortBabiesPipe } from "../../../utils/pipes/sort-babies-pipe";
import { PrefixPipe } from "../../../utils/pipes/prefix-pipe";

@Component({
  selector: 'app-order-editor',
  standalone: true,
  imports: [FaIconComponent, DateStrPipe, NgFor, SortBabiesPipe, PrefixPipe],
  templateUrl: './order-editor.component.html',
  styleUrl: './order-editor.component.scss'
})
export class OrderEditorComponent implements OnInit {
  orderDetails: OrderDetails = {
    id: 0,
    order_id_with_customer: '',
    order_status: Status.new,
    isurgent: false,
    customer_name: '',
    wing_name: '',
    wall_material: '',
    wall_material_color: '',
    kippa_size: 0,
    wing_quantity: 0,
    crown_material: '',
    crown_material_color: '',
    crown_visible: 0,
    crown_length: 0,
    knife: 0,
    white_hair_notes: '',
    white_hair: 0,
    h_material: '',
    h_material_color: '',
    date: new Date(),
    adjusted_wings_per_hat: '',
    shorten_top_by: 0,
    shorten_crown_by: 0,
    tails_overdraft: 0,
    mayler_width: 0,
    hr_hl_width: 0,
    order_notes: '',
    original_order_date: null,
    babies: []
  };
  faArrowsRotate: IconDefinition = faArrowsRotate;
  loading: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private toastService: ToastService){
    
  }

  ngOnInit(): void {
      const id = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
      this.getOrder(id);
  }

  async getOrder(id: number){
    this.loading = true;
    this.orderDetails = await firstValueFrom(this.ordersService.getOrder(id));
    console.dir(this.orderDetails);
    this.loading = false;
  }

}
