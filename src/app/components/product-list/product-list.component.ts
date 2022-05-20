import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] | undefined;
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean | undefined;
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  previousKeyword: string | null = "";


  constructor(private productService: ProductService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.listProducts();
      }
    );

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap
      .has('keyword');
    if (this.searchMode) {
      this.handleSearchProductsPagination();
    } else {
      // this.handleListProducts();
      this.handleListProductsPagination();
    }

  }

  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword');
    this.productService
      // @ts-ignore
      .searchProducts(keyword)
      .subscribe(
        data => {
          this.products = data;
        }
      )
  }

  handleSearchProductsPagination() {
    const keyword = this.route.snapshot.paramMap.get('keyword');
    // check if we have a different category id than previous
    // if so, then set pageNumber to 1.
    // we have to do this because angular will reuse a component if it is currently being viewed
    if (this.previousKeyword !== keyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, thePageNumber=${this.thePageNumber}`)

    this.productService
      // @ts-ignore
      .searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, keyword)
      .subscribe(this.processResult())
  }

  handleListProducts() {
    // check if id is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    this.productService
      .getProductListByCategoryId(this.currentCategoryId)
      .subscribe(
        data => {
          this.products = data;
        }
      );
  }

  handleListProductsPagination() {
    // check if id is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    // check if we have a different category id than previous
    // if so, then set pageNumber to 1.
    // we have to do this because angular will reuse a component if it is currently being viewed
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)


    this.productService
      .getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }


  private processResult() {
    return (data: { _embedded: { products: Product[] | undefined; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(event: Event) {
    // @ts-ignore
    this.thePageSize = event.target.value;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
