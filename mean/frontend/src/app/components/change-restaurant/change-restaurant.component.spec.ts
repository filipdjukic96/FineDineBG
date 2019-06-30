import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRestaurantComponent } from './change-restaurant.component';

describe('ChangeRestaurantComponent', () => {
  let component: ChangeRestaurantComponent;
  let fixture: ComponentFixture<ChangeRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
