import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtimeHistoryComponent } from './airtime-history.component';

describe('AirtimeHistoryComponent', () => {
  let component: AirtimeHistoryComponent;
  let fixture: ComponentFixture<AirtimeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirtimeHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirtimeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
