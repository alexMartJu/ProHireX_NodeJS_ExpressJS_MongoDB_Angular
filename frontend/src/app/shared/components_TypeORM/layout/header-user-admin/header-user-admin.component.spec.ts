import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUserAdminComponent } from './header-user-admin.component';

describe('HeaderUserAdminComponent', () => {
  let component: HeaderUserAdminComponent;
  let fixture: ComponentFixture<HeaderUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderUserAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
