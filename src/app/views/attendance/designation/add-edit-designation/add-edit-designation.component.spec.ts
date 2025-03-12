import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDesignationComponent } from './add-edit-designation.component';

describe('AddEditDesignationComponent', () => {
  let component: AddEditDesignationComponent;
  let fixture: ComponentFixture<AddEditDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDesignationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
