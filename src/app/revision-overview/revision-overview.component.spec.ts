import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionOverviewComponent } from './revision-overview.component';

describe('RevisionOverviewComponent', () => {
  let component: RevisionOverviewComponent;
  let fixture: ComponentFixture<RevisionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
