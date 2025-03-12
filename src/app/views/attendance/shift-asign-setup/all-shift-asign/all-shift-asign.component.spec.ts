import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShiftAsignComponent } from './all-shift-asign.component';

describe('AllShiftAsignComponent', () => {
  let component: AllShiftAsignComponent;
  let fixture: ComponentFixture<AllShiftAsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllShiftAsignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllShiftAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
