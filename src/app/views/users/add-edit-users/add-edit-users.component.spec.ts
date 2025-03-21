import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUsersComponent } from './add-edit-users.component';

describe('AddEditUsersComponent', () => {
  let component: AddEditUsersComponent;
  let fixture: ComponentFixture<AddEditUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
