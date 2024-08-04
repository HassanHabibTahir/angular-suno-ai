import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongFormModalComponent } from './song-form-modal.component';

describe('SongFormModalComponent', () => {
  let component: SongFormModalComponent;
  let fixture: ComponentFixture<SongFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
