import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJobPendingDashboardComponent } from './list-job-pending-dashboard.component';

describe('ListJobPendingDashboardComponent', () => {
  let component: ListJobPendingDashboardComponent;
  let fixture: ComponentFixture<ListJobPendingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListJobPendingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListJobPendingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
