import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {

  }

  // @ts-ignore
  product: Product | undefined;

  // @ts-ignore
  theProductId: number = +this.route.snapshot.paramMap.get('id');

  ngOnInit(): void {
    this.route.paramMap.subscribe(
        () => {
          this.handleProductDetails(this.theProductId);
        }
      )
  }

  handleProductDetails(theProductId: number){
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

}
