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

package org.comixedproject.model.tasks;

/**
 * <code>PersistedTaskType</code> defines the list of supported tasks that can be performed.
 *
 * @author Darryl L. Pierce
 */
public enum PersistedTaskType {
  MONITOR_TASK_QUEUE,
  ADD_COMIC,
  PROCESS_COMIC,
  RESCAN_COMIC,
  RESCAN_COMICS,
  DELETE_COMIC,
  DELETE_COMICS,
  UNDELETE_COMIC,
  UNDELETE_COMICS,
  MOVE_COMIC,
  MOVE_COMICS,
  CONVERT_COMIC,
  QUEUE_COMICS;
}
