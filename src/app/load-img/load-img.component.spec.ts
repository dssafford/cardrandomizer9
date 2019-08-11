import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadImgComponent } from './load-img.component';

describe('LoadImgComponent', () => {
  let component: LoadImgComponent;
  let fixture: ComponentFixture<LoadImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
