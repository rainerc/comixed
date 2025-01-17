/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2019, The ComiXed Project
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

package org.comixedproject.controller.app;

import com.fasterxml.jackson.annotation.JsonView;
import java.text.ParseException;
import lombok.extern.log4j.Log4j2;
import org.comixedproject.auditlog.AuditableEndpoint;
import org.comixedproject.model.app.BuildDetails;
import org.comixedproject.service.app.DetailsService;
import org.comixedproject.views.View;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <code>BuildDetailsController</code> handles requests for build details.
 *
 * @author Darryl L. Pierce
 */
@RestController
@Log4j2
public class BuildDetailsController {
  @Autowired private DetailsService detailsService;

  /**
   * Retrieves the build details.
   *
   * @return the build details
   * @throws ParseException if an error occurs
   */
  @GetMapping(value = "/api/build-details", produces = MediaType.APPLICATION_JSON_VALUE)
  @AuditableEndpoint
  @JsonView(View.BuildDetails.class)
  public BuildDetails getBuildDetails() throws ParseException {
    log.info("Getting application build details");
    return this.detailsService.getBuildDetails();
  }
}
