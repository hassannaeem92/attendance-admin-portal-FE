import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTimezoneComponent } from './add-edit-timezone.component';

describe('AddEditTimezoneComponent', () => {
  let component: AddEditTimezoneComponent;
  let fixture: ComponentFixture<AddEditTimezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTimezoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
