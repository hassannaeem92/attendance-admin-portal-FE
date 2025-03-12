import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTimezoneComponent } from './all-timezone.component';

describe('AllTimezoneComponent', () => {
  let component: AllTimezoneComponent;
  let fixture: ComponentFixture<AllTimezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTimezoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
