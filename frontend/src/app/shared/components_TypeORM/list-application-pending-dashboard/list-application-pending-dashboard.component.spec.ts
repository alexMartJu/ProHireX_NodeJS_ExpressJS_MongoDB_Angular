import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationPendingDashboardComponent } from './list-application-pending-dashboard.component';

describe('ListApplicationPendingDashboardComponent', () => {
  let component: ListApplicationPendingDashboardComponent;
  let fixture: ComponentFixture<ListApplicationPendingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListApplicationPendingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApplicationPendingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
