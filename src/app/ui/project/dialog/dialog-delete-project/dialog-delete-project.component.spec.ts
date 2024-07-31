import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteProjectComponent } from './dialog-delete-project.component';

describe('DialogDeleteProjectComponent', () => {
  let component: DialogDeleteProjectComponent;
  let fixture: ComponentFixture<DialogDeleteProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
