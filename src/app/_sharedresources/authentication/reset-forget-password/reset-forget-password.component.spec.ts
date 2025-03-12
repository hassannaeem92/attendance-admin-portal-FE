import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetForgetPasswordComponent } from './reset-forget-password.component';

describe('ResetForgetPasswordComponent', () => {
  let component: ResetForgetPasswordComponent;
  let fixture: ComponentFixture<ResetForgetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetForgetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
