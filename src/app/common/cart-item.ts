import {Product} from "./product";


export class CartItem{
  private _id: string | undefined;
  private _name: string | undefined;
  private _imageUrl: string | undefined;
  private _unitPrice: number | undefined;
  private _quantity: number | undefined;

  constructor(product: Product) {
    // @ts-ignore
    this._id = product.id.toString();
    this._name = product.name;
    this._imageUrl = product.imageUrl;
    this._unitPrice = product.unitPrice;
    this._quantity = 1;
  }


  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    this._id = value;
  }

  get name(): string | undefined {
    return this._name;
  }

  set name(value: string | undefined) {
    this._name = value;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  set imageUrl(value: string | undefined) {
    this._imageUrl = value;
  }

  get unitPrice(): number | undefined {
    return this._unitPrice;
  }

  set unitPrice(value: number | undefined) {
    this._unitPrice = value;
  }

  get quantity(): number | undefined {
    return this._quantity;
  }

  set quantity(value: number | undefined) {
    this._quantity = value;
  }


}
