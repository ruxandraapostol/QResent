package com.project.qresent.controller;

import com.project.qresent.model.Coordinates;
import com.project.qresent.model.Interval;
import com.project.qresent.model.Subject;
import com.project.qresent.repository.IntervalRepository;
import com.project.qresent.repository.SubjectRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/QResent")
public class SubjectController {

  private final SubjectRepository subjectRepository;
  private final IntervalRepository intervalRepository;

  public SubjectController(SubjectRepository subjectRepository, IntervalRepository intervalRepository) {
    this.subjectRepository = subjectRepository;
    this.intervalRepository = intervalRepository;
  }

  @GetMapping("/subjects")
  public List<Subject> getAllSubjects() {
    return this.subjectRepository.findAll();
  }

  @RequestMapping("/getSubjectByProfessor/{ldap:.+}")
  public List<Subject> getSubjectsByProfessor(@PathVariable String ldap) {
    return this.subjectRepository.findByProfessorLdap(ldap);
  }

  @PostMapping(value = "/addSubject", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> addSubject(@RequestBody Subject subject) {
    this.subjectRepository.save(subject);

    return ResponseEntity.ok(subject + " added");
  }

  @PutMapping(value = "/editSubject/{subjectName}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> editSubject(@PathVariable String subjectName, @RequestBody Subject subject) {
    Subject dbSubject = this.subjectRepository.findByName(subjectName);

    if (dbSubject == null) {
      return ResponseEntity.badRequest().body("Subject not found!");
    }

    if (subject.getDescription() != null) {
      dbSubject.setDescription(subject.getDescription());
    }

    if (subject.getName() != null) {
      dbSubject.setName(subject.getName());
    }

    if (subject.getPoints() != null) {
      dbSubject.setPoints(subject.getPoints());
    }

    if (subject.getProfessorLdap() != null) {
      dbSubject.setProfessorLdap(subject.getProfessorLdap());
    }

    this.subjectRepository.save(dbSubject);

    return ResponseEntity.ok(subject + " added");
  }


  @DeleteMapping(value = "/deleteSubject/{subjectName}")
  public ResponseEntity<String> deleteSubject(@PathVariable String subjectName) {
    this.subjectRepository.delete(this.subjectRepository.findByName(subjectName));

    return ResponseEntity.ok(subjectName + " deleted");
  }

  @GetMapping(value = "/getIntervals/{subjectName}")
  public List<Interval> getIntervals(@PathVariable String subjectName) {
    return this.subjectRepository.findByName(subjectName).getIntervals();
  }

  @PostMapping(value = "/addInterval/{subjectName}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> addInterval(@PathVariable String subjectName, @RequestBody Interval interval) {
    Subject subject = this.subjectRepository.findByName(subjectName);

    if (subject == null) {
      return ResponseEntity.ok("This subject doesn't exist!");
    } else {
      interval.setSubjectName(subjectName);
      this.intervalRepository.save(interval);

      subject.getIntervals().add(this.intervalRepository.findTopByOrderByIdDesc());
      this.subjectRepository.save(subject);

      return ResponseEntity.ok(interval + " added for " + subjectName);
    }
  }

  @DeleteMapping(value = "/deleteInterval/{subjectName}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> deleteInterval(@PathVariable String subjectName, @RequestBody Interval interval) {
    Subject subject = this.subjectRepository.findByName(subjectName);

    if (subject == null) {
      return ResponseEntity.ok("This subject doesn't exist!");
    } else {
      Interval dbInterval = this.intervalRepository.getById(interval.getId());

      if (dbInterval == null) {
        return ResponseEntity.ok("Interval doesn't exist!");
      } else {
        subject.getIntervals().remove(dbInterval);

        this.intervalRepository.deleteById(dbInterval.getId());
        this.subjectRepository.save(subject);

        return ResponseEntity.ok(dbInterval + " deleted from " + subjectName);
      }
    }
  }

  @PutMapping(value = "/editInterval/{subjectName}/{intervalName}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> editInterval(@PathVariable String subjectName, @PathVariable String intervalName, @RequestBody Interval interval) {
    Interval dbInterval = this.intervalRepository.findIntervalByNameAndSubjectName(intervalName, subjectName);

    if (dbInterval == null) {
      return ResponseEntity.badRequest().body(interval + " doesn't exist");
    }

    if (interval.getName() != null) {
      dbInterval.setName(interval.getName());
    }

    if (interval.getDate() != null) {
      dbInterval.setDate(interval.getDate());
    }

    if (interval.getHours() != null) {
      dbInterval.setHours(interval.getHours());
    }

    intervalRepository.save(dbInterval);

    return ResponseEntity.ok(interval + " updated");
  }

  @GetMapping(value = "/getStats/{subjectName}/{intervalName}")
  public ResponseEntity getStats(@PathVariable String subjectName, @PathVariable String intervalName) {
    Subject subject = this.subjectRepository.findByName(subjectName);

    if(subject == null){
      return ResponseEntity.badRequest().body("Subject not Found");
    }

    Interval interval = this.intervalRepository.findIntervalByNameAndSubjectName(intervalName, subjectName);

    if(interval == null){
      return ResponseEntity.badRequest().body("Interval not Found");

    }
    List<Coordinates> coordinates = new ArrayList<>();

    interval.getTokenList().forEach(token -> {
      coordinates.add(new Coordinates(token.getCreatedDateTime(), token.getScannedCount()));
    });

    return ResponseEntity.ok().body(coordinates);
  }
}
