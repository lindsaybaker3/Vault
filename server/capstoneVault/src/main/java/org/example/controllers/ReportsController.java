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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.*;
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

    @GetMapping("/reports")
    public List<Reports> findByUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        return reportsService.findByUserId(appUser.getAppUserId());
    }

    @GetMapping("/report/{reportId}/download")
    public ResponseEntity<Resource> download(@PathVariable int reportId) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        String fileName = "";
        Result result = reportsService.download(reportId,fileName);
        byte[] bytes = (byte[]) result.getPayload();
// Create a Spring Resource from the byte array
        ByteArrayResource resource = new ByteArrayResource(bytes);


        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");


        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(bytes.length)
                .contentType(MediaType.APPLICATION_PDF)
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

