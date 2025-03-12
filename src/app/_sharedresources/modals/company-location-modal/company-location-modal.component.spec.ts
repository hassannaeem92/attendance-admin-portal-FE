import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLocationModalComponent } from './company-location-modal.component';

describe('CompanyLocationModalComponent', () => {
  let component: CompanyLocationModalComponent;
  let fixture: ComponentFixture<CompanyLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyLocationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
