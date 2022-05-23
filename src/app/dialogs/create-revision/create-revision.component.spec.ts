import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRevisionComponent } from './create-revision.component';

describe('CreateRevisionComponent', () => {
  let component: CreateRevisionComponent;
  let fixture: ComponentFixture<CreateRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
