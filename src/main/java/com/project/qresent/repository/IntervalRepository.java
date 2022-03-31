package com.project.qresent.repository;

import com.project.qresent.model.Interval;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntervalRepository extends JpaRepository<Interval, Long> {
  Interval findTopByOrderByIdDesc();

  Interval findIntervalByNameAndSubjectName(String name, String subjectName);

  Interval findIntervalByName(String name);

  void deleteById(Long id);
}
