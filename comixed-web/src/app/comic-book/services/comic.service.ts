/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2021, The ComiXed Project
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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comic } from '@app/comic-book/models/comic';
import { LoggerService } from '@angular-ru/logger';
import { HttpClient } from '@angular/common/http';
import {
  LOAD_COMIC_URL,
  LOAD_COMICS_URL,
  UPDATE_COMIC_URL
} from '@app/library/library.constants';
import { interpolate } from '@app/core';
import { LoadComicsRequest } from '@app/comic-book/models/net/load-comics-request';
import { UPDATE_COMIC_INFO_URL } from '@app/comic-book/comic-book.constants';

@Injectable({
  providedIn: 'root'
})
export class ComicService {
  constructor(private logger: LoggerService, private http: HttpClient) {}

  /**
   * Loads a batch of comics.
   *
   * @param args.lastId the last id received
   */
  loadBatch(args: { lastId: number }): Observable<any> {
    this.logger.debug('Loading a batch of comics:', args);
    return this.http.post(interpolate(LOAD_COMICS_URL), {
      lastId: args.lastId
    } as LoadComicsRequest);
  }

  /**
   * Loads a single comic.
   *
   * @param args.id the comic id
   */
  loadOne(args: { id: number }): Observable<any> {
    this.logger.debug('Loading one comic:', args);
    return this.http.get(interpolate(LOAD_COMIC_URL, { id: args.id }));
  }

  /**
   * Updates a single comic.
   *
   * @param args.comic the comic
   */
  updateOne(args: { comic: Comic }): Observable<any> {
    this.logger.debug('Updating one comic:', args);
    return this.http.put(
      interpolate(UPDATE_COMIC_URL, { id: args.comic.id }),
      args.comic
    );
  }

  /**
   * Updates the comicinfo.xml in a comic.
   *
   * @param args.comic the comic
   */
  updateComicInfo(args: { comic: Comic }): Observable<any> {
    this.logger.debug('Updating ComicInfo.xml:', args);
    return this.http.post(
      interpolate(UPDATE_COMIC_INFO_URL, { id: args.comic.id }),
      {}
    );
  }
}
