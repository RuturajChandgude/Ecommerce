import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkOrderComponent } from './add-bulk-order.component';

describe('AddBulkOrderComponent', () => {
  let component: AddBulkOrderComponent;
  let fixture: ComponentFixture<AddBulkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBulkOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBulkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
