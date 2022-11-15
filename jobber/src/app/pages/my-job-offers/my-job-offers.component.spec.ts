import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobOffersComponent } from './my-job-offers.component';

describe('CandidatesComponent', () => {
  let component: MyJobOffersComponent;
  let fixture: ComponentFixture<MyJobOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyJobOffersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyJobOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
