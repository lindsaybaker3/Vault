package org.example.data;

import org.example.models.Goals;

import java.util.List;

public interface GoalsRepository {

   List<Goals> findByUserId(int userId);


   Goals findById(int goalId);

   Goals addGoal(Goals goal);

   boolean update(Goals goals);

   boolean deleteById(int goalId);




}
