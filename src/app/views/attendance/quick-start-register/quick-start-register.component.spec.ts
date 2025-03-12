import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickStartRegisterComponent } from './quick-start-register.component';

describe('QuickStartRegisterComponent', () => {
  let component: QuickStartRegisterComponent;
  let fixture: ComponentFixture<QuickStartRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickStartRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickStartRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
