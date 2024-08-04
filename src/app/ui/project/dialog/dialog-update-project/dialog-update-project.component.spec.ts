import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateProjectComponent } from './dialog-update-project.component';

describe('DialogUpdateProjectComponent', () => {
  let component: DialogUpdateProjectComponent;
  let fixture: ComponentFixture<DialogUpdateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUpdateProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUpdateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
