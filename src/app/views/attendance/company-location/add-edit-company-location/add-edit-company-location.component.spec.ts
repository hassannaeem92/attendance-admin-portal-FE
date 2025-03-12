import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCompanyLocationComponent } from './add-edit-company-location.component';

describe('AddEditCompanyLocationComponent', () => {
  let component: AddEditCompanyLocationComponent;
  let fixture: ComponentFixture<AddEditCompanyLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCompanyLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCompanyLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
