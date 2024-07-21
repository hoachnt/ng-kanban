import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteKanbanListComponent } from './dialog-delete-kanban-list.component';

describe('DialogDeleteKanbanListComponent', () => {
  let component: DialogDeleteKanbanListComponent;
  let fixture: ComponentFixture<DialogDeleteKanbanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteKanbanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteKanbanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
