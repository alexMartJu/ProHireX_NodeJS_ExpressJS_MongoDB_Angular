import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUserEnterpriseComponent } from './header-user-enterprise.component';

describe('HeaderUserEnterpriseComponent', () => {
  let component: HeaderUserEnterpriseComponent;
  let fixture: ComponentFixture<HeaderUserEnterpriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderUserEnterpriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderUserEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
