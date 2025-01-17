/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2020, The ComiXed Project.
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

package org.comixedproject.task.encoders;

import static junit.framework.TestCase.*;

import org.comixedproject.model.comic.Comic;
import org.comixedproject.model.tasks.PersistedTask;
import org.comixedproject.model.tasks.PersistedTaskType;
import org.comixedproject.service.task.TaskService;
import org.comixedproject.task.UndeleteComicTask;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.ObjectFactory;

@RunWith(MockitoJUnitRunner.class)
public class UndeleteComicTaskEncoderTest {
  @InjectMocks private UndeleteComicTaskEncoder encoder;
  @Mock private ObjectFactory<UndeleteComicTask> undeleteComicTaskObjectFactory;
  @Mock private UndeleteComicTask undeleteComicTask;
  @Mock private Comic comic;
  @Mock private TaskService taskService;

  private PersistedTask persistedTask = new PersistedTask();

  @Test
  public void encode() {
    encoder.setComic(comic);

    PersistedTask result = encoder.encode();

    assertNotNull(result);
    assertEquals(PersistedTaskType.UNDELETE_COMIC, result.getTaskType());
    assertSame(comic, result.getComic());
  }

  @Test
  public void testDecode() {
    persistedTask.setComic(comic);
    persistedTask.setTaskType(PersistedTaskType.UNDELETE_COMIC);

    Mockito.when(undeleteComicTaskObjectFactory.getObject()).thenReturn(undeleteComicTask);

    final UndeleteComicTask result = encoder.decode(persistedTask);

    assertNotNull(result);
    assertSame(undeleteComicTask, result);

    Mockito.verify(taskService, Mockito.times(1)).delete(persistedTask);
    Mockito.verify(undeleteComicTask, Mockito.times(1)).setComic(comic);
  }
}
