import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintsPage } from './constraints.page';

describe('ConstraintsPage', () => {
  let component: ConstraintsPage;
  let fixture: ComponentFixture<ConstraintsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstraintsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstraintsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
