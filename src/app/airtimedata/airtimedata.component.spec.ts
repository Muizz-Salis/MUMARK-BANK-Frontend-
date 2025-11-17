import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtimedataComponent } from './airtimedata.component';

describe('AirtimedataComponent', () => {
  let component: AirtimedataComponent;
  let fixture: ComponentFixture<AirtimedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirtimedataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirtimedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
