package com.project.qresent.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Attendance {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private LocalDateTime scannedDateTime;

  @ManyToOne
  private Student student;

  public Attendance() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public LocalDateTime getScannedDateTime() {
    return scannedDateTime;
  }

  public void setScannedDateTime(LocalDateTime date) {
    this.scannedDateTime = date;
  }

  public Student getStudent() {
    return student;
  }

  public void setStudent(Student student) {
    this.student = student;
  }

}
