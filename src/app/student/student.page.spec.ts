import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPage } from './student.page';

describe('StudentPage', () => {
  let component: StudentPage;
  let fixture: ComponentFixture<StudentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
