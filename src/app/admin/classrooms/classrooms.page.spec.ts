import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomsPage } from './classrooms.page';

describe('ClassroomsPage', () => {
  let component: ClassroomsPage;
  let fixture: ComponentFixture<ClassroomsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassroomsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
