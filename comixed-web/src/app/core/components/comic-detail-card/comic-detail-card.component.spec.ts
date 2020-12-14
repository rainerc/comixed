/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2020, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComicDetailCardComponent } from './comic-detail-card.component';
import { MatCardModule } from '@angular/material/card';
import { LoggerModule } from '@angular-ru/logger';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DISPLAY_FEATURE_KEY,
  initialState as initialDisplayState
} from '@app/library/reducers/display.reducer';

describe('ComicDetailCardComponent', () => {
  const initialState = { [DISPLAY_FEATURE_KEY]: initialDisplayState };

  let component: ComicDetailCardComponent;
  let fixture: ComponentFixture<ComicDetailCardComponent>;
  let store: MockStore<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComicDetailCardComponent],
      imports: [LoggerModule.forRoot(), MatCardModule],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(ComicDetailCardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading user preferences', () => {
    const PAGE_SIZE = 400;

    beforeEach(() => {
      component.imageWidth = `100px`;
      store.setState({
        ...initialState,
        [DISPLAY_FEATURE_KEY]: { ...initialDisplayState, pageSize: PAGE_SIZE }
      });
    });

    it('sets the page size', () => {
      expect(component.imageWidth).toEqual(`${PAGE_SIZE}px`);
    });
  });
});
