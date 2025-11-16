import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatchAnimationComponent } from './catch-animation.component';

describe('CatchAnimation', () => {
  let component: CatchAnimationComponent;
  let fixture: ComponentFixture<CatchAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatchAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CatchAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
