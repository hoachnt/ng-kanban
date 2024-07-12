import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropListGroupComponent } from './drop-list-group.component';

describe('DropListGroupComponent', () => {
  let component: DropListGroupComponent;
  let fixture: ComponentFixture<DropListGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropListGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropListGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
