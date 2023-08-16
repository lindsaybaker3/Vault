package org.example.models;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class GoalsTest {

    @Test
    void categoryallowedSameGoalId() {
        Goals existingGoal = new Goals();
        existingGoal.setGoalsId(1);
        existingGoal.setCategoryId(2);
        existingGoal.setStartDate(LocalDate.now().plusDays(1));
        existingGoal.setEndDate(LocalDate.now().plusDays(30));

        Goals newGoal = new Goals();
        newGoal.setGoalsId(1);
        newGoal.setCategoryId(2);
        newGoal.setStartDate(LocalDate.now().plusDays(3));
        newGoal.setEndDate(LocalDate.now().plusDays(40));

        assertTrue(existingGoal.isCategoryAllowed(newGoal));
    }

    @Test
    void categoryAllowedOverlappingDates(){
        Goals existingGoal = new Goals();
        existingGoal.setGoalsId(1);
        existingGoal.setCategoryId(2);
        existingGoal.setStartDate(LocalDate.now().plusDays(1));
        existingGoal.setEndDate(LocalDate.now().plusDays(30));

        Goals newGoal = new Goals();
        newGoal.setGoalsId(3);
        newGoal.setCategoryId(2);
        newGoal.setStartDate(LocalDate.now().plusDays(3));
        newGoal.setEndDate(LocalDate.now().plusDays(40));

        assertFalse(existingGoal.isCategoryAllowed(newGoal));
    }

    @Test
    void categoryAllowedOverlappingDates2(){
        Goals existingGoal = new Goals();
        existingGoal.setGoalsId(1);
        existingGoal.setCategoryId(2);
        existingGoal.setStartDate(LocalDate.now().plusDays(3));
        existingGoal.setEndDate(LocalDate.now().plusDays(30));

        Goals newGoal = new Goals();
        newGoal.setGoalsId(3);
        newGoal.setCategoryId(2);
        newGoal.setStartDate(LocalDate.now().plusDays(2));
        newGoal.setEndDate(LocalDate.now().plusDays(4));

        assertFalse(existingGoal.isCategoryAllowed(newGoal));
    }

    @Test
    void categoryAllowedDiffCatOverlappingDates(){
        Goals existingGoal = new Goals();
        existingGoal.setGoalsId(1);
        existingGoal.setCategoryId(1);
        existingGoal.setStartDate(LocalDate.now().plusDays(3));
        existingGoal.setEndDate(LocalDate.now().plusDays(30));

        Goals newGoal = new Goals();
        newGoal.setGoalsId(3);
        newGoal.setCategoryId(2);
        newGoal.setStartDate(LocalDate.now().plusDays(2));
        newGoal.setEndDate(LocalDate.now().plusDays(4));

        assertTrue(existingGoal.isCategoryAllowed(newGoal));
    }
}