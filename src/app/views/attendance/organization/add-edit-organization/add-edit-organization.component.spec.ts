import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOrganizationComponent } from './add-edit-organization.component';

describe('AddEditOrganizationComponent', () => {
  let component: AddEditOrganizationComponent;
  let fixture: ComponentFixture<AddEditOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
