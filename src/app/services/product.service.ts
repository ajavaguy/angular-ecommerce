import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {ProductCategory} from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) {
  }

  getProductList(): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(this.baseUrl)
      .pipe(
        map(response => response._embedded.products)
      );
  }

  // TypeScript provides the concept of function overloading.
  // You can have multiple functions with the same name but different parameter types and return type.
  // However, the number of parameters should be the same.
  getProductListByCategoryId(categoryId: number): Observable<Product[]> {
    const searchProductsByCategoryId = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.httpClient
      .get<GetResponseProduct>(searchProductsByCategoryId)
      .pipe(
        map(response => response._embedded.products)
      )
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(
        map(response => response._embedded.productCategory)
      );
  }

  searchProducts(categoryName: string): Observable<Product[]> {
    const searchProductsByKeyword = `${this.baseUrl}/search/findByNameContaining?name=${categoryName}`;
    return this.httpClient
      .get<GetResponseProduct>(searchProductsByKeyword)
      .pipe(
        map(response => response._embedded.products)
      )
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryName: string): Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/search/findByNameContaining?name=${theCategoryName}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProduct(theProductId: number) {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    console.log("productUrl: " + productUrl);
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(url);
  }


}


interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  }
}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
