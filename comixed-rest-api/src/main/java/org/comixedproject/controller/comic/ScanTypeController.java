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

package org.comixedproject.controller.comic;

import com.fasterxml.jackson.annotation.JsonView;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.comixedproject.auditlog.AuditableEndpoint;
import org.comixedproject.model.comic.ScanType;
import org.comixedproject.service.comic.ScanTypeService;
import org.comixedproject.views.View;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * <code>ScanTypeController</code> provides APIs for working with {@link
 * org.comixedproject.model.comic.ScanType}s.
 *
 * @author Darryl L. Pierce
 */
@Controller
@Log4j2
public class ScanTypeController {
  @Autowired private ScanTypeService scanTypeService;

  /**
   * Retrieves the list of all scan types and publishes them.
   *
   * @return the scan types
   */
  @GetMapping(
      value = "/api/comics/scantypes",
      produces = {MediaType.APPLICATION_JSON_VALUE})
  @AuditableEndpoint
  @JsonView(View.ScanTypeList.class)
  public List<ScanType> getScanTypes() {
    log.info("Getting all scan types");
    return this.scanTypeService.getAll();
  }
}
