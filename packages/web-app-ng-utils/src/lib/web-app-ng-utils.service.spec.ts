import { TestBed } from '@angular/core/testing';

import { WebAppNgUtilsService } from './web-app-ng-utils.service';

describe('WebAppNgUtilsService', () => {
  let service: WebAppNgUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebAppNgUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
