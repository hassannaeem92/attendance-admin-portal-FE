import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLocationModalComponent } from './organization-location-modal.component';

describe('OrganizationLocationModalComponent', () => {
  let component: OrganizationLocationModalComponent;
  let fixture: ComponentFixture<OrganizationLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationLocationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
