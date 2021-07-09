import { Component, OnInit, Input } from '@angular/core';

import { CategoryService } from '../../categories/services/category.service';
import { ProductService } from '../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'ngx-product-to-category',
  templateUrl: './product-to-category.component.html',
  styleUrls: ['./product-to-category.component.scss']
})
export class ProductToCategoryComponent implements OnInit {
  @Input() product;

  loading: boolean = false;
  // categories: Array<any> = [];
  perPage: number = 10;
  currentPage: number = 1;
  // totalCount: number;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  // request params
  params = {
    // lang: this.storageService.getLanguage(),
    count: this.perPage,
    page: 0
  };

  constructor(
    private translate: TranslateService,
    private categoryService: CategoryService,
    private storageService: StorageService,
    private productService: ProductService,
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      enableCheckAll: false,
      searchPlaceholderText: 'Search by code',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 8,
      allowSearchFilter: true,
      allowRemoteDataSearch: true

    };
  }

  ngOnInit() {
    // console.log(this.pro duct)
    if (this.product.categories.length > 0) {
      this.product.categories.forEach((data) => {
        this.selectedItems.push({ 'id': data.id, 'text': data.descriptions[0].name })
      });
    }
    this.product
    this.getList();
  }

  getList() {
    this.params.page = this.currentPage - 1;
    this.loading = true;
    this.categoryService.getListOfCategories(this.params)
      .subscribe(categories => {
        // console.log(categories);
        let tempArr = []
        categories.categories.forEach((value) => {
          tempArr.push({ 'id': value.id, 'text': value.description.name })
        })
        this.dropdownList = tempArr;
        // this.selectedItems = categories.categories;
        // this.totalCount = categories.totalPages;
        this.loading = false;
      });
    // this.translate.onLangChange.subscribe((event) => {
    // });
  }

  onFilterChange(e) {
    // console.log(e);
    // this.loading = true;
  }

  onItemSelect(item: any) {
    // console.log(item);
    this.loading = true;
    this.addProductToCategory(this.product.id, item.id)
    // this.loading = true;
  }
  onItemDeSelect(item: any) {
    // console.log(item)
    this.loading = true;
    this.removeProductFromCategory(this.product.id, item.id)
  }
  addProductToCategory(productId, groupCode) {
    this.productService.addProductToCategory(productId, groupCode)
      .subscribe(res => {
        console.log(res, '========');
        this.loading = false;
      });
  }

  removeProductFromCategory(productId, groupCode) {
    this.productService.removeProductFromCategory(productId, groupCode)
      .subscribe(res => {
        console.log(res);
        this.loading = false;
      });
  }


}
