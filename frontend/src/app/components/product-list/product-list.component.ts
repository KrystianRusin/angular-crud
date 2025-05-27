import { Component, OnInit } from '@angular/core';
import { Product, ProductService, ProductFilter} from '../../services/product.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { NgFor, NgIf } from '@angular/common';
import { AddProductFormComponent } from "../add-product-form/add-product-form.component";
import { ProductFilterComponent } from "../product-filter/product-filter.component";

@Component({
  selector: 'product-list',
  imports: [ProductItemComponent, NgFor, NgIf, AddProductFormComponent, ProductFilterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  productList!: Product[]
  filteredList!: Product[]
  addingProduct: boolean = false
  sortColumn: keyof Product = 'id'
  sortAsc = true;

  constructor(private productService: ProductService ) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  private compareValues(a: any, b: any): number {
    const na = parseFloat(a), nb = parseFloat(b);
    if (!isNaN(na) && !isNaN(nb)) {
      return na - nb;
    }
    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  }

  sortBy(col: keyof Product) {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
    this.filteredList = [...this.filteredList].sort((x, y) => {
      const cmp = this.compareValues(x[col], y[col]);
      return this.sortAsc ? cmp : -cmp;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productList = products
        this.filteredList = this.productList
      },
      error: (error) => {
        alert(`There was an error retrieving the product list ${error}`)
      }
    })
  }

  editProduct(product: Product){
    product.updated_at = new Date().toISOString()
    this.productService.editProduct(product).subscribe({
      error: (error) => {
        alert("There was an error editing this product!")
      }
    })
  }

  deleteProduct(productDeleted: Product) {
      this.productService.deleteProduct(productDeleted).subscribe({
      next: (product) => {
        this.filteredList = this.filteredList.filter(product => product.id != productDeleted.id)
      }
    })
  }

  addProduct(productAdded: Product){
    this.productService.addProduct(productAdded).subscribe({
      next: (product) => {
        this.productList.push(product)
      }
    })
    this.addingProduct = false
  }

filterProducts(filter: ProductFilter) {
  let list = this.productList;

  if (filter.name) {
    const q = filter.name.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }

  if (filter.description) {
    const q = filter.description.toLowerCase();
    list = list.filter(p => p.description.toLowerCase().includes(q));
  }

  if (filter.price != null) {
    list = list.filter(p => {
      const priceNum = typeof p.price === 'number'
        ? p.price
        : parseFloat(String(p.price));
      return priceNum === filter.price;
    });
  }

  if (filter.in_stock != null) {
    list = list.filter(p => p.in_stock === filter.in_stock);
  }

  if (filter.category && filter.category !== 'All') {
    list = list.filter(p => p.category === filter.category);
  }

  if (filter.tags?.length) {
    const wanted = filter.tags.map(t => t.toLowerCase());
    list = list.filter(p => {
      const have = (p.tags ?? []).map(t => t.toLowerCase());
      return wanted.every(t => have.includes(t));
    });
  }

  this.filteredList = list;
  }
}
