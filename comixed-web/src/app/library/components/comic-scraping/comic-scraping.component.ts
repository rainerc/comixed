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

import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ScrapingVolume } from '@app/library/models/scraping-volume';
import { Comic } from '@app/library';
import { MatTableDataSource } from '@angular/material/table';
import { LoggerService } from '@angular-ru/logger';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ScrapingIssue } from '@app/library/models/scraping-issue';
import { Store } from '@ngrx/store';
import {
  loadScrapingIssue,
  resetScraping,
  scrapeComic
} from '@app/library/actions/scraping.actions';
import { Subscription } from 'rxjs';
import { selectScrapingIssue } from '@app/library/selectors/scraping.selectors';
import { ConfirmationService, SortableListItem } from '@app/core';
import { TranslateService } from '@ngx-translate/core';

export const MATCHABILITY = 'matchability';
export const EXACT_MATCH = 2;
export const EXACT_MATCH_TEXT = 'scraping.text.exact-match';
export const NEAR_MATCH = 1;
export const NEAR_MATCH_TEXT = 'scraping.text.near-match';
export const NO_MATCH = 0;
export const NO_MATCH_TEXT = 'scraping.text.no-match';

@Component({
  selector: 'cx-comic-scraping',
  templateUrl: './comic-scraping.component.html',
  styleUrls: ['./comic-scraping.component.scss']
})
export class ComicScrapingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() comic: Comic;
  @Input() comicSeriesName: string;
  @Input() comicVolume: string;
  @Input() comicIssueNumber: string;
  @Input() apiKey: string;
  @Input() skipCache = false;
  @Input() pageSize: number;

  issueSubscription: Subscription;
  issue: ScrapingIssue;

  dataSource = new MatTableDataSource<SortableListItem<ScrapingVolume>>();
  displayedColumns = [
    MATCHABILITY,
    'publisher',
    'name',
    'startYear',
    'issueCount'
  ];

  constructor(
    private logger: LoggerService,
    private store: Store<any>,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    this.issueSubscription = this.store
      .select(selectScrapingIssue)
      .subscribe(issue => (this.issue = issue));
  }

  @Input() set volumes(volumes: ScrapingVolume[]) {
    this.logger.trace('Received scraping volumes');
    this.dataSource.data = volumes.map(volume => {
      const sortOrder =
        volume.name === this.comicSeriesName &&
        volume.startYear === this.comicVolume
          ? EXACT_MATCH
          : volume.name === this.comicSeriesName
          ? NEAR_MATCH
          : NO_MATCH;
      return {
        item: volume,
        sortOrder
      } as SortableListItem<ScrapingVolume>;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.issueSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (element, property) => {
      switch (property) {
        case MATCHABILITY:
          return element.sortOrder;
        default:
          return element.item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }

  onVolumeSelected(volume: ScrapingVolume): void {
    this.logger.trace('Volume selected:', volume);
    this.store.dispatch(
      loadScrapingIssue({
        apiKey: this.apiKey,
        volumeId: volume.id,
        issueNumber: this.comicIssueNumber,
        skipCache: this.skipCache
      })
    );
  }

  onDecision(decision: boolean): void {
    this.logger.trace(
      `Scraping issue was ${decision ? 'accepted' : 'rejected'}`
    );
    if (decision) {
      this.confirmationService.confirm({
        title: this.translateService.instant(
          'scraping.scrape-comic-confirmation-title'
        ),
        message: this.translateService.instant(
          'scraping.scrape-comic-confirmation-message'
        ),
        confirm: () => {
          this.logger.trace('User confirmed scraping the comic');
          this.store.dispatch(
            scrapeComic({
              apiKey: this.apiKey,
              issueId: this.issue.id,
              comic: this.comic,
              skipCache: this.skipCache
            })
          );
        }
      });
    } else {
      this.issue = null;
    }
  }

  onCancelScraping(): void {
    this.logger.trace('Canceling scraping');
    this.store.dispatch(resetScraping());
  }
}