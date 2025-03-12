import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOrganizationLocationComponent } from './add-edit-organization-location.component';

describe('AddEditOrganizationLocationComponent', () => {
  let component: AddEditOrganizationLocationComponent;
  let fixture: ComponentFixture<AddEditOrganizationLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditOrganizationLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditOrganizationLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
