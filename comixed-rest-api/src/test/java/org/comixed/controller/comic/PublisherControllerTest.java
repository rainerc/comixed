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

package org.comixed.controller.comic;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertSame;

import org.comixed.model.comic.Publisher;
import org.comixed.service.comic.PublisherException;
import org.comixed.service.comic.PublisherService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;

@RunWith(MockitoJUnitRunner.class)
public class PublisherControllerTest {
  private static final String TEST_PUBLISHER_NAME = "Publisher Name";
  private static final byte[] TEST_IMAGE_DATA = "Image data".getBytes();

  @InjectMocks private PublisherController publisherController;
  @Mock private PublisherService publisherService;
  @Mock private Publisher publisher;

  @Test(expected = PublisherException.class)
  public void testGetByNameNoSuchPublisher() throws PublisherException {
    Mockito.when(publisherService.getByName(Mockito.anyString()))
        .thenThrow(PublisherException.class);

    try {
      publisherController.getByName(TEST_PUBLISHER_NAME);
    } finally {
      Mockito.verify(publisherService, Mockito.times(1)).getByName(TEST_PUBLISHER_NAME);
    }
  }

  @Test
  public void testGetByName() throws PublisherException {
    Mockito.when(publisherService.getByName(Mockito.anyString())).thenReturn(publisher);

    Publisher result = publisherController.getByName(TEST_PUBLISHER_NAME);

    assertNotNull(result);
    assertSame(publisher, result);

    Mockito.verify(publisherService, Mockito.times(1)).getByName(TEST_PUBLISHER_NAME);
  }

  @Test(expected = PublisherException.class)
  public void testGetThumnailNoSuchPublisher() throws PublisherException {
    Mockito.when(publisherService.getByName(Mockito.anyString()))
        .thenThrow(PublisherException.class);

    try {
      publisherController.getThumbnail(TEST_PUBLISHER_NAME);
    } finally {
      Mockito.verify(publisherService, Mockito.times(1)).getByName(TEST_PUBLISHER_NAME);
    }
  }

  @Test
  public void testGetThumbnail() throws PublisherException {
    Mockito.when(publisherService.getByName(Mockito.anyString())).thenReturn(publisher);
    Mockito.when(publisher.getThumbnail()).thenReturn(TEST_IMAGE_DATA);

    ResponseEntity<byte[]> result = publisherController.getThumbnail(TEST_PUBLISHER_NAME);

    assertNotNull(result);
    assertSame(TEST_IMAGE_DATA, result.getBody());

    Mockito.verify(publisherService, Mockito.times(1)).getByName(TEST_PUBLISHER_NAME);
    Mockito.verify(publisher, Mockito.times(1)).getThumbnail();
  }

  @Test(expected = PublisherException.class)
  public void testGetLogoNoSuchPublisher() throws PublisherException {
    Mockito.when(publisherService.getByName(Mockito.anyString()))
        .thenThrow(PublisherException.class);

    try {
      publisherController.getThumbnail(TEST_PUBLISHER_NAME);
    } finally {
      Mockito.verify(publisherService, Mockito.times(1)).getByName(TEST_PUBLISHER_NAME);
    }
  }

  @Test
  public void testGetLogo() throws PublisherException {
    Mockito.when(publisherService.getByName(Mockito.anyString())).thenReturn(publisher);
    Mockito.when(publisher.getLogo()).thenReturn(TEST_IMAGE_DATA);

    ResponseEntity<byte[]> result = publisherController.getLogo(TEST_PUBLISHER_NAME);

    assertNotNull(result);
    assertSame(TEST_IMAGE_DATA, result.getBody());

    Mockito.verify(publisherService, Mockito.times(1)).getByName(TEST_PUBLISHER_NAME);
    Mockito.verify(publisher, Mockito.times(1)).getLogo();
  }
}
