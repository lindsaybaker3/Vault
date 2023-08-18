package org.example.controllers;

import org.example.domain.AppUserService;
import org.example.domain.GoalsService;
import org.example.domain.Result;
import org.example.domain.ResultType;
import org.example.models.AppUser;
import org.example.models.Goals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/goals")
    public List<Goals> findByUserId() throws DataAccessException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Assuming username is the identifier
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        return service.findByUserId(appUser.getAppUserId());
    }

    @GetMapping("/goals/{goalId}")
    public ResponseEntity<Goals> findById(@PathVariable int goalId) throws DataAccessException {


        Goals goal = service.findById(goalId);
        if(goal == null){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        //invoke the current balance here
        goal.getCurrentBalance();
        return new ResponseEntity<>(goal, HttpStatus.OK);
    }

    @PostMapping("/goal/create")
    public ResponseEntity<Object> addGoal(@RequestBody Goals goal){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Assuming username is the identifier
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);

        Result result = service.addGoal(goal);
        if(!result.isSuccess()){
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/goal/{goalId}")
    public ResponseEntity<Object> update(@PathVariable int goalId, @RequestBody Goals goal) throws DataAccessException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Assuming username is the identifier
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        if(appUser.getAppUserId() != goal.getAppUserId()){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if(goalId != goal.getGoalsId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Result result = service.update(goal);
        if(!result.isSuccess()){
            if(result.getResultType() == ResultType.NOT_FOUND){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("goal/{goalId}")
    public ResponseEntity<Object> delete(@PathVariable int goalId) throws DataAccessException {
        Result result = service.deleteById(goalId);
        if (!result.isSuccess()) {
            if (result.getResultType() == ResultType.NOT_FOUND) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
            }

        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
