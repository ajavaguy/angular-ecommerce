import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(item => item.id == theCartItem.id);
      console.log("I AM INSIDE CART SERVICE")
      // check if we really found the item
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      let quantity = existingCartItem?.quantity;
      // @ts-ignore
      quantity += 1;
      // @ts-ignore
      existingCartItem?.quantity = quantity;
    } else {
      // push the item into the cart
      this.cartItems.push(theCartItem);
    }
    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  private computeCartTotals() {

    let totalPriceValueOfItemsInTheCart: number = 0;
    let totalQuantityValueOfItemsInTheCart: number = 0;

    this.cartItems.forEach(cartItem => {
      // @ts-ignore
      totalPriceValueOfItemsInTheCart += (cartItem.quantity * cartItem.unitPrice);
      // @ts-ignore
      totalQuantityValueOfItemsInTheCart += cartItem.quantity;
    });

    // publish the values -- all subscribers will receive the new data
    this.totalPrice.next(totalPriceValueOfItemsInTheCart);
    this.totalQuantity.next(totalQuantityValueOfItemsInTheCart);
    this.logCartData(totalPriceValueOfItemsInTheCart, totalQuantityValueOfItemsInTheCart);
  }


  private logCartData(totalPriceValueOfItemsInTheCart: number, totalQuantityValueOfItemsInTheCart: number) {
    console.log('contents of cart')
    this.cartItems.forEach(cartItem => {
      // @ts-ignore
      const subTotal = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity: ${cartItem.quantity}, unitPrice: ${cartItem.unitPrice}, subTotal: ${subTotal}`)
    })
    console.log(`The totalPriceValueOfItemsInTheCart ${totalPriceValueOfItemsInTheCart} and
    The totalQuantityValueOfItemsInTheCart ${totalQuantityValueOfItemsInTheCart}`)

    console.log("-----END OF CART ITEM LOGS----")
  }
}
