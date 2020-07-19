import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadImg3Component } from './load-img3.component';

describe('LoadImg3Component', () => {
  let component: LoadImg3Component;
  let fixture: ComponentFixture<LoadImg3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadImg3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadImg3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
