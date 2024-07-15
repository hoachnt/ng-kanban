import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddKanbanItemFormComponent } from './dialog-add-kanban-item-form.component';

describe('DialogAddKanbanItemFormComponent', () => {
  let component: DialogAddKanbanItemFormComponent;
  let fixture: ComponentFixture<DialogAddKanbanItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddKanbanItemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddKanbanItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
