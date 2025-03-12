import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSvgIconComponent } from './custom-svg-icon.component';

describe('CustomSvgIconComponent', () => {
  let component: CustomSvgIconComponent;
  let fixture: ComponentFixture<CustomSvgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSvgIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
