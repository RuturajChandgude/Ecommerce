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
@Component({
  selector: 'app-products-data',
  imports: [CommonModule, MatSortModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatDialogModule],
  templateUrl: './products-data.component.html',
  styleUrl: './products-data.component.scss'
})
export class ProductsDataComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['productId', 'productName', 'productCategory', 'productCost','productQuantity','weight','color','width','height', 'edit', 'delete'];
  public dataSource = new MatTableDataSource<GetProduct>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private productService: ProductsService, private dialog: MatDialog) { }
  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

}
