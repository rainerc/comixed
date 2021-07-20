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

import { createAction, props } from '@ngrx/store';
import { ComicFile } from '@app/comic-file/models/comic-file';

export const sendComicFiles = createAction(
  '[Import Comic Files] Begin importing the selected comic files',
  props<{
    files: ComicFile[];
    ignoreMetadata: boolean;
    deleteBlockedPages: boolean;
  }>()
);

export const comicFilesSent = createAction(
  '[Import Comic Files] Importing comic files has started'
);

export const sendComicFilesFailed = createAction(
  '[Import Comic Files] Failed to begin importing comic files'
);