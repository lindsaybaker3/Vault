package org.example.controllers;

import org.example.domain.AppUserService;
import org.example.domain.GoalsService;
import org.example.models.Goals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/vault")
@CrossOrigin
public class GoalsController {
    private final GoalsService service;
    private final AppUserService appUserService;
@Autowired
    public GoalsController(GoalsService service, AppUserService appUserService) {
        this.service = service;
        this.appUserService = appUserService;
    }

    @GetMapping("/goals/user/{appUserId}")
    public List<Goals> findByUserId(@PathVariable int appUserId) throws DataAccessException {
        return service.findByUserId(appUserId);
    }

    @GetMapping("/goals/{goalId}")
    public ResponseEntity<Goals> findById(@PathVariable int goalId) throws DataAccessException {
        return null;
    }
}
