import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDesignationComponent } from './all-designation.component';

describe('AllDesignationComponent', () => {
  let component: AllDesignationComponent;
  let fixture: ComponentFixture<AllDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDesignationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
