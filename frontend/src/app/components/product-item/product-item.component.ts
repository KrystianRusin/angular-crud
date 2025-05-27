import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../services/product.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tr[product-item]',
  imports: [NgIf, FormsModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() product!: Product
  @Output() productEdit: EventEmitter<Product> = new EventEmitter()
  @Output() productDelete: EventEmitter<Product> = new EventEmitter()

  isEditing: boolean = false

  editProduct() {
    this.isEditing = !this.isEditing
    this.productEdit.emit(this.product)
  }

  deleteProduct(){
    this.productDelete.emit(this.product)
  }

}
