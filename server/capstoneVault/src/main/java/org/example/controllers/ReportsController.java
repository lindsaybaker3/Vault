package org.example.controllers;

import org.example.domain.AppUserService;
import org.example.domain.ReportsService;
import org.example.domain.Result;
import org.example.domain.ResultType;
import org.example.models.AppUser;
import org.example.models.Goals;
import org.example.models.Reports;
import org.example.models.Transactions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/vault")
public class ReportsController {

    private final AppUserService appUserService;
    private final ReportsService reportsService;

    @Autowired
    public ReportsController(AppUserService appUserService, ReportsService reportsService) {
        this.appUserService = appUserService;
        this.reportsService = reportsService;
    }

    @GetMapping("/report/{reportId}/download")
    public ResponseEntity<Resource> download(@PathVariable int reportId) throws FileNotFoundException {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);

        Result result = reportsService.download(reportId);
        File file = (File) result.getPayload();
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }


    @PostMapping("/report")
    public ResponseEntity<Object> create(@RequestBody Reports report) {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        report.setAppUserId(appUser.getAppUserId());

        Result result = reportsService.create(report);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/report/{reportId}")
    public ResponseEntity<Void> delete(@PathVariable int reportId) {
        Result result = reportsService.deleteById(reportId);
        if (result.getResultType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}

