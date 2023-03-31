import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyviewComponent } from './companyview.component';

describe('CompanyviewComponent', () => {
  let component: CompanyviewComponent;
  let fixture: ComponentFixture<CompanyviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
