package com.project.qresent.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Subject {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String description;

  private String professorLdap;

  private String points;

  @OneToMany(cascade = CascadeType.REMOVE)
  private List<Interval> intervals;

  public Subject() {
    this.intervals = new ArrayList<>();
  }

  public Subject(Long id, String name, String description, String professorLdap) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.professorLdap = professorLdap;

    this.intervals = new ArrayList<>();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getProfessorLdap() {
    return professorLdap;
  }

  public void setProfessorLdap(String professorLdap) {
    this.professorLdap = professorLdap;
  }

  public String getPoints() {
    return points;
  }

  public void setPoints(String points) {
    this.points = points;
  }

  public List<Interval> getIntervals() {
    return intervals;
  }

  public void setIntervals(List<Interval> intervals) {
    this.intervals = intervals;
  }

  @Override
  public String toString() {
    return "Subject{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", description='" + description + '\'' +
      ", professorLdap='" + professorLdap + '\'' +
      ", points='" + points + '\'' +
      ", intervals=" + intervals +
      '}';
  }
}
