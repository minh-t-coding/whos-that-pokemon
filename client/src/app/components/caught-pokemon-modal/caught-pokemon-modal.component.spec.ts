import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaughtPokemonModalComponent } from './caught-pokemon-modal.component';

describe('CaughtPokemonModalComponent', () => {
  let component: CaughtPokemonModalComponent;
  let fixture: ComponentFixture<CaughtPokemonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaughtPokemonModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaughtPokemonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
