import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePage } from './generate.page';

describe('GeneratePage', () => {
  let component: GeneratePage;
  let fixture: ComponentFixture<GeneratePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
