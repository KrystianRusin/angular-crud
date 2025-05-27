import { Component, EventEmitter, Output } from '@angular/core';
import { ProductFilter } from '../../services/product.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'product-filter',
  imports: [FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
  @Output() filterUpdated: EventEmitter<ProductFilter> = new EventEmitter()

  filter: ProductFilter = {category: "All"};
  rawTags = '';

  filterChange() {
    this.filterUpdated.emit(this.filter)
  }

  onTagsChange(val: string) {
    this.rawTags = val;
    const arr = val
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    this.filter.tags = arr;
    this.filterChange();
  }

}
