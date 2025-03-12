import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShiftComponent } from './all-shift.component';

describe('AllShiftComponent', () => {
  let component: AllShiftComponent;
  let fixture: ComponentFixture<AllShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllShiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
