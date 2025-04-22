import { TestBed } from '@angular/core/testing';

import { HousemanshipService } from './housemanship.service';

describe('HousemanshipService', () => {
  let service: HousemanshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousemanshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
