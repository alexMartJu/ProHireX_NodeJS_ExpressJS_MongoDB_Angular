import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobItemDashboardComponent } from './job-item-dashboard.component';

describe('JobItemDashboardComponent', () => {
  let component: JobItemDashboardComponent;
  let fixture: ComponentFixture<JobItemDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobItemDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobItemDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
