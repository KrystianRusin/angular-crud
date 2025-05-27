import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id?: number,
  name: string,
  description: string,
  price: number,
  in_stock: boolean,
  created_at?: string,
  updated_at?: string,
  category: 'ELECTRONICS' | 'BOOKS' | 'CLOTHING' | 'HOME' | 'TOYS';
  tags?: string[],
  metadata?: Record<string,any>
}

export interface ProductFilter {
  name?: string;
  description?: string;
  price?: number;      
  in_stock?: boolean;   
  category: 'All' |'ELECTRONICS' | 'BOOKS' | 'CLOTHING' | 'HOME' | 'TOYS';
  tags?: string[];      
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }


  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>("http://localhost:3000/api/products", product)
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>("http://localhost:3000/api/products")
  }

  deleteProduct(product: Product): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/api/products/${product.id}`)
  }

  editProduct(product: Product): Observable<Product> {
    console.log(product)
    return this.http.put<Product>(`http://localhost:3000/api/products/${product.id}`, product)
  }

}
