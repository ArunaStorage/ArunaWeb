import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsOverviewComponent } from './objects-overview.component';

describe('ObjectsOverviewComponent', () => {
  let component: ObjectsOverviewComponent;
  let fixture: ComponentFixture<ObjectsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
