import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingSkillsComponent } from './saving-skills.component';

describe('SavingSkillsComponent', () => {
  let component: SavingSkillsComponent;
  let fixture: ComponentFixture<SavingSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingSkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
