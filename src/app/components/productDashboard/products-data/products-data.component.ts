import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductsService } from '../../../core/services/products/products.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { GetProduct } from '../../../core/models/products/get-product';
import { AddEditProductDialogComponent } from '../add-edit-product-dialog/add-edit-product-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProduct } from '../../../core/models/products/update-product';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { ProductCategory } from '../../../core/models/category/product-category';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { AddBulkOrderComponent } from '../add-bulk-order/add-bulk-order.component';
import { CurrencyService } from '../../../core/services/currency/currency.service';

@Component({
  selector: 'app-products-data',
  imports: [CommonModule,FormsModule,MatButtonToggleModule, MatSelectModule, MatSortModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatDialogModule],
  templateUrl: './products-data.component.html',
  styleUrl: './products-data.component.scss'
})
export class ProductsDataComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['productId', 'productName', 'productCategory', 'productCost', 'productQuantity', 'weight', 'color', 'width', 'height', 'edit', 'delete'];
  public allProducts = JSON.parse(localStorage.getItem('products') || '[]');
  public dataSource = new MatTableDataSource<GetProduct>();
  public productCategories = JSON.parse(localStorage.getItem('productCategories') || '[]')
  public selectedCategory: string = '';
  public selectedFilter:string='';
  public newSelectedCurrency:string='';

  public categories: ProductCategory[] = [
    { productCategoryId: 1, productCategory: 'Electronics' },
    { productCategoryId: 2, productCategory: 'Groceries' },
    { productCategoryId: 3, productCategory: 'Sports and Fitness' },
    { productCategoryId: 4, productCategory: 'Appliances' },
    { productCategoryId: 5, productCategory: 'Fashion' },
    { productCategoryId: 6, productCategory: 'Books' }
  ]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private currencyService:CurrencyService,private productService: ProductsService, private dialog: MatDialog) { }
  ngOnInit() {
    this.loadProducts();
    this.categories.sort((a,b)=> a.productCategory.localeCompare(b.productCategory))
    const categoryArrayString = JSON.stringify(this.categories);
    localStorage.setItem('productCategories', categoryArrayString);
    this.dataSource.filterPredicate=(data:GetProduct,filter:string)=>{
      const filterNumber=parseFloat(filter);
      return data.productCategory.productCategory.toLowerCase().includes(filter) || data.productName.toLowerCase().includes(filter)
       || data.productCost===filterNumber || data.weight===filterNumber || data.color.toLowerCase().includes(filter) 
       || data.width===filterNumber || data.height===filterNumber
    }
    
    this.currencyService.sharedCurrency$.subscribe(data=>{
      this.newSelectedCurrency=data
     
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

 

  public openAddBulk(){
    const productData=this.productService.getProducts();
    const dialogRef=this.dialog.open(AddBulkOrderComponent,{
      width:'600px',
      height:'500px',
      data:productData
    })
  }
  public loadProducts() {
    const productData = this.productService.getProducts();
    if (productData) {
      this.dataSource.data = productData;
    }
  }

  public openAddDialog() {
    const dialogRef = this.dialog.open(AddEditProductDialogComponent, {
      width: '550px',
      height: '550px'
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.AddProducts(result);
        this.loadProducts()
      }
    })
  }

  public openEditDialog(productUpdate: UpdateProduct) {
    if (productUpdate) {
      const dialogRef = this.dialog.open(AddEditProductDialogComponent, {
        width: '550px',
        height: '550px',
        data: productUpdate
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.productService.updateProduct(result);
          this.loadProducts()
        }
      })
    }
  }

  public deleteProduct(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      this.productService.deleteProduct(id);
      this.loadProducts();
    }
  }

  public onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  public searchSelectedCategoryProducts() {
    const filteredArray= this.allProducts.filter((item:GetProduct) =>
      item.productCategory.productCategory === this.selectedCategory
    ) 
    this.dataSource.data =filteredArray;
  }
  
  public applyFilter(){
    const productData = this.productService.getProducts();
    if(this.selectedFilter==='all')
    {
      this.dataSource.data=productData
    }
    else if(this.selectedFilter==='inStock')
    {
      this.dataSource.data=productData.filter(item=>item.productQuantity>0)
    }
    else{
      this.dataSource.data=productData.filter(item=>item.productQuantity==0)
    }
  }

}
