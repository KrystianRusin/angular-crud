import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../services/product.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'add-product-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-product-form.component.html',
  styleUrl: './add-product-form.component.css'
})
export class AddProductFormComponent {

  @Output() productAdded: EventEmitter<Product> = new EventEmitter()

  categories = ['BOOKS', 'CLOTHING', 'HOME', 'TOYS', 'ELECTRONICS'] as const;
  
  addProductForm!: FormGroup

  constructor(private fb: FormBuilder){
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      in_stock: [false],
      category: [this.categories[0]],
      tags: ['']
    })
  }


  addProduct() {
    if (this.addProductForm.valid){
      const rawTags = this.addProductForm.value.tags as string;
      const tagsArray = rawTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const product: Product = {
        ...this.addProductForm.value,
        tags: tagsArray
      };
      this.productAdded.emit(product)
      this.addProductForm.reset()
    }
  }
}
