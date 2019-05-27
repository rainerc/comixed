/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2018, The ComiXed Project
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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/app.state';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as UserActions from 'app/actions/user.actions';
import { ImportState } from 'app/models/state/import-state';
import { Library } from 'app/models/actions/library';
import * as ImportingActions from 'app/actions/importing.actions';
import { SelectItem } from 'primeng/api';
import { ComicFile } from 'app/models/import/comic-file';
import { User } from 'app/models/user/user';
import { Preference } from 'app/models/user/preference';
import { ComicService } from 'app/services/comic.service';
import {
  IMPORT_COVER_SIZE,
  IMPORT_LAST_DIRECTORY,
  IMPORT_ROWS,
  IMPORT_SORT
} from 'app/models/user/preferences.constants';
import { LibraryDisplay } from 'app/models/state/library-display';

const ROWS_PARAMETER = 'rows';
const SORT_PARAMETER = 'sort';
const COVER_PARAMETER = 'coversize';

const COVER_SIZE_PREFERENCE = 'cover_size';
const SORT_PREFERENCE = 'import_sort';
const ROWS_PREFERENCE = 'import_rows';

@Component({
  selector: 'app-import-page',
  templateUrl: './import-page.component.html',
  styleUrls: ['./import-page.component.css']
})
export class ImportPageComponent implements OnInit, OnDestroy {
  library$: Observable<Library>;
  library_subscription: Subscription;
  library: Library;

  library_display$: Observable<LibraryDisplay>;
  library_display_subscription: Subscription;
  library_display: LibraryDisplay;

  import_state$: Observable<ImportState>;
  import_state_subscription: Subscription;
  import_state: ImportState;

  comic_files: Array<ComicFile> = [];
  selected_comic_files: Array<ComicFile> = [];
  user$: Observable<User>;
  user_subscription: Subscription;
  user: User;
  protected sort_options: Array<SelectItem>;
  protected sort_by: string;
  protected rows_options: Array<SelectItem>;
  protected rows: number;
  protected cover_size: number;
  protected plural = false;
  protected any_selected = false;
  protected show_selections_only = false;
  protected delete_blocked_pages = false;

  constructor(
    private comic_service: ComicService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.library$ = store.select('library');
    this.library_display$ = store.select('library_display');
    this.user$ = store.select('user');
    this.import_state$ = store.select('import_state');
    activatedRoute.queryParams.subscribe(params => {
      this.sort_by = params[SORT_PARAMETER] || 'filename';
      this.rows = parseInt(params[ROWS_PARAMETER] || '10', 10);
      this.cover_size = parseInt(params[COVER_PARAMETER] || '200', 10);
    });
    this.sort_options = [
      {
        label: 'Filename',
        value: 'filename'
      },
      {
        label: 'Size',
        value: 'size'
      }
    ];
    this.rows_options = [
      {
        label: '10 comics',
        value: 10
      },
      {
        label: '25 comics',
        value: 25
      },
      {
        label: '50 comics',
        value: 50
      },
      {
        label: '100 comics',
        value: 100
      }
    ];
  }

  ngOnInit() {
    this.library_subscription = this.library$.subscribe((library: Library) => {
      this.library = library;
    });
    this.library_display_subscription = this.library_display$.subscribe(
      (library_display: LibraryDisplay) => {
        this.library_display = library_display;
      }
    );
    this.user_subscription = this.user$.subscribe((user: User) => {
      this.user = user;

      this.sort_by = this.get_parameter(IMPORT_SORT) || this.sort_by;
      this.rows = parseInt(
        this.get_parameter(IMPORT_ROWS) || `${this.rows}`,
        10
      );
      this.cover_size = parseInt(
        this.get_parameter(IMPORT_COVER_SIZE) || `${this.cover_size}`,
        10
      );
      const directory = (
        this.user.preferences.find((preference: Preference) => {
          return preference.name === IMPORT_LAST_DIRECTORY;
        }) || { value: '' }
      ).value;
      this.store.dispatch(
        new ImportingActions.ImportingSetDirectory({ directory: directory })
      );
    });
    this.import_state_subscription = this.import_state$.subscribe(
      (import_state: ImportState) => {
        this.import_state = import_state;

        if (this.import_state) {
          this.comic_files = [].concat(import_state.files);
          this.selected_comic_files = [].concat(
            import_state.files.filter((comic_file: ComicFile) => {
              return comic_file.selected;
            })
          );

          if (!this.import_state.updating_status) {
            this.store.dispatch(
              new ImportingActions.ImportingGetPendingImports()
            );
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.library_subscription.unsubscribe();
    this.user_subscription.unsubscribe();
    this.import_state_subscription.unsubscribe();
  }

  set_sort_by(sort_by: string): void {
    this.sort_by = sort_by;
    this.update_params(SORT_PARAMETER, this.sort_by);
    this.store.dispatch(
      new UserActions.UserSetPreference({
        name: IMPORT_SORT,
        value: sort_by
      })
    );
  }

  set_rows(rows: number): void {
    this.rows = rows;
    this.update_params(ROWS_PARAMETER, `${this.rows}`);
    this.store.dispatch(
      new UserActions.UserSetPreference({
        name: IMPORT_ROWS,
        value: `${rows}`
      })
    );
  }

  set_cover_size(cover_size: number): void {
    this.cover_size = cover_size;
  }

  save_cover_size(cover_size: number): void {
    this.update_params(COVER_PARAMETER, `${this.cover_size}`);
    this.store.dispatch(
      new UserActions.UserSetPreference({
        name: IMPORT_COVER_SIZE,
        value: `${cover_size}`
      })
    );
  }

  retrieve_files(directory: string): void {
    this.store.dispatch(
      new UserActions.UserSetPreference({
        name: IMPORT_LAST_DIRECTORY,
        value: directory
      })
    );
    this.store.dispatch(
      new ImportingActions.ImportingFetchFiles({ directory: directory })
    );
  }

  set_select_all(select: boolean): void {
    if (select) {
      this.select_comics(this.import_state.files);
    } else {
      this.unselect_comics(this.import_state.files);
    }
  }

  import_selected_files(): void {
    this.store.dispatch(
      new ImportingActions.ImportingImportFiles({
        files: this.import_state.files
          .filter(file => file.selected)
          .map(file => file.filename),
        ignore_metadata: false
      })
    );
  }

  plural_imports(): boolean {
    return this.library.library_state.import_count !== 1;
  }

  get_import_title(): string {
    if (this.library.library_state.import_count === 0) {
      return 'Preparing To Import Comics...';
    }
    return (
      `There ${this.plural_imports() ? 'Are' : 'Is'} ${
        this.library.library_state.import_count
      } ` +
      `Comic${this.plural_imports() ? 's' : ''} Remaining To Be Imported...`
    );
  }

  get_comic_selection_title(): string {
    if (this.import_state.files.length === 0) {
      return 'No Comics Are Loaded';
    } else {
      return `Selected ${this.import_state.selected_count} Of ${
        this.import_state.files.length
      } Comics...`;
    }
  }

  set_show_selections_only(show: boolean): void {
    this.show_selections_only = show;
  }

  set_delete_blocked_pages(value: boolean): void {
    this.delete_blocked_pages = value;
  }

  disable_inputs(): boolean {
    return this.import_state.files.length === 0;
  }

  toggle_selected_state(file: ComicFile): void {
    const files = new Array<ComicFile>();
    files.push(file);
    if (file.selected) {
      this.unselect_comics(files);
    } else {
      this.select_comics(files);
    }
  }

  private get_parameter(name: string): string {
    const which = this.user.preferences.find((preference: Preference) => {
      return preference.name === name;
    });

    if (which) {
      return which.value;
    } else {
      return null;
    }
  }

  private select_comics(files: Array<ComicFile>): void {
    this.store.dispatch(
      new ImportingActions.ImportingSelectFiles({ files: files })
    );
  }

  private unselect_comics(files: Array<ComicFile>): void {
    this.store.dispatch(
      new ImportingActions.ImportingUnselectFiles({ files: files })
    );
  }

  private update_params(name: string, value: string): void {
    const queryParams: Params = Object.assign(
      {},
      this.activatedRoute.snapshot.queryParams
    );
    if (value && value.length) {
      queryParams[name] = value;
    } else {
      queryParams[name] = null;
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams
    });
  }
}
