import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDevicesComponent } from './add-edit-devices.component';

describe('AddEditDevicesComponent', () => {
  let component: AddEditDevicesComponent;
  let fixture: ComponentFixture<AddEditDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDevicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
