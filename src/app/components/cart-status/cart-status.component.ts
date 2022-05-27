import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPriceOfItemsInTheCart: number = 0.00;
  totalQuantityOfItemsInTheCart: number = 0;

  constructor(private cartService: CartService) {

  }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPriceOfItemsInTheCart = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantityOfItemsInTheCart = data
    )
  }
}
