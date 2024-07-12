import { TestBed } from '@angular/core/testing';

import { KanbanServiceService } from './kanban.service';

describe('KanbanServiceService', () => {
  let service: KanbanServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
