import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrganizationLocationComponent } from './all-organization-location.component';

describe('AllOrganizationLocationComponent', () => {
  let component: AllOrganizationLocationComponent;
  let fixture: ComponentFixture<AllOrganizationLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrganizationLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrganizationLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
