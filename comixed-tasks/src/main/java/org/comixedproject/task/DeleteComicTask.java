/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2017, The ComiXed Project
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

package org.comixedproject.task;

import com.fasterxml.jackson.annotation.JsonView;
import java.io.File;
import java.io.IOException;
import java.text.MessageFormat;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.FileUtils;
import org.comixedproject.model.comic.Comic;
import org.comixedproject.model.library.ReadingList;
import org.comixedproject.model.tasks.PersistedTaskType;
import org.comixedproject.service.comic.ComicService;
import org.comixedproject.service.library.ReadingListService;
import org.comixedproject.views.View;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * <code>DeleteComicTask</code> deletes a single comic from the library and also the underlying
 * comic file.
 *
 * @author Darryl L. Pierce
 */
@Component
@Log4j2
public class DeleteComicTask extends AbstractTask implements Task {
  @Autowired private ComicService comicService;
  @Autowired private ReadingListService readingListService;

  @JsonView(View.AuditLogEntryDetail.class)
  @Getter
  @Setter
  private boolean deleteFile;

  @JsonView(View.AuditLogEntryDetail.class)
  @Getter
  @Setter
  private Comic comic;

  public DeleteComicTask() {
    super(PersistedTaskType.DELETE_COMIC);
  }

  @Override
  @Transactional
  public void startTask() {
    if (!comic.getReadingLists().isEmpty()) {
      log.debug(
          "Removing comic from {} reading list{}",
          comic.getReadingLists().size(),
          comic.getReadingLists().size() == 1 ? "" : "s");
      while (!comic.getReadingLists().isEmpty()) {
        ReadingList[] readingLists =
            comic.getReadingLists().toArray(new ReadingList[comic.getReadingLists().size()]);
        for (int index = 0; index < readingLists.length; index++) {
          ReadingList readingList = readingLists[index];
          readingList.getComics().remove(comic);
          comic.getReadingLists().remove(readingList);
          log.debug("Updating reading list: {}", readingList.getName());
          this.readingListService.save(readingList);
        }
      }
    }

    if (this.deleteFile) {
      final String filename = this.comic.getFilename();
      log.debug("Deleting comic file: {}", filename);
      File file = new File(filename);
      try {
        FileUtils.forceDelete(file);
        log.debug("Removing comic from library: id={}", this.comic.getId());
        this.comicService.delete(this.comic);
      } catch (IOException error) {
        log.error("Unable to delete comic: {}", filename, error);
      }
    }
  }

  @Override
  protected String createDescription() {
    return MessageFormat.format(
        "Deleting comic: id={0} [delete file={1}]", this.comic.getId(), this.deleteFile);
  }
}
