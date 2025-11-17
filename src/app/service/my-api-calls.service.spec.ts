import { TestBed } from '@angular/core/testing';

import { MyApiCallsService } from './my-api-calls.service';

describe('MyApiCallsService', () => {
  let service: MyApiCallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyApiCallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
