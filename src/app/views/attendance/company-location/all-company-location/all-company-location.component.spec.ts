import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCompanyLocationComponent } from './all-company-location.component';

describe('AllCompanyLocationComponent', () => {
  let component: AllCompanyLocationComponent;
  let fixture: ComponentFixture<AllCompanyLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCompanyLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCompanyLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
