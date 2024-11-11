import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsSpellcastingComponent } from './weapons-spellcasting.component';

describe('WeaponsSpellcastingComponent', () => {
  let component: WeaponsSpellcastingComponent;
  let fixture: ComponentFixture<WeaponsSpellcastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponsSpellcastingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponsSpellcastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
