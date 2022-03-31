package com.project.qresent.model;

import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
public class Token {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String token;

  @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP")
  @Convert(converter = Jsr310JpaConverters.LocalDateTimeConverter.class)
  private LocalDateTime createdDateTime;

  @Column(columnDefinition = "TIMESTAMP")
  @Convert(converter = Jsr310JpaConverters.LocalDateTimeConverter.class)
  private LocalDateTime disabledDateTime;

  private Boolean disabled;

  private Integer scannedCount;

  @OneToMany(cascade = CascadeType.REMOVE)
  private List<Attendance> attendances;

  public Token() {
    this.token = UUID.randomUUID().toString();
    this.createdDateTime = LocalDateTime.now();
    this.disabled = false;
    this.scannedCount = 0;
  }

  public Boolean getDisabled() {
    return disabled;
  }

  public void setDisabled(Boolean disabled) {
    this.disabled = disabled;
  }

  public void disableToken() {
    this.disabled = true;
    this.disabledDateTime = LocalDateTime.now();
  }

  public Boolean isDisabled() {
    return this.disabled;
  }

  public Integer getScannedCount() {
    return scannedCount;
  }

  public void setScannedCount(Integer scannedCount) {
    this.scannedCount = scannedCount;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public LocalDateTime getCreatedDateTime() {
    return createdDateTime;
  }

  public void setCreatedDateTime(LocalDateTime createdDate) {
    this.createdDateTime = createdDate;
  }

  public LocalDateTime getDisabledDateTime() {
    return disabledDateTime;
  }

  public void setDisabledDateTime(LocalDateTime disabledTime) {
    this.disabledDateTime = disabledTime;
  }

  public List<Attendance> getAttendances() {
    return attendances;
  }

  public void setAttendances(List<Attendance> attendance) {
    this.attendances = attendance;
  }

  public Boolean attendanceListContainsUser(String ldap) {
    for (Attendance attendance : attendances) {
      if (attendance.getStudent().getLdap().equals(ldap)) {
        return true;
      }
    }

    return false;
  }

  @Override
  public String toString() {
    return "Token{" +
      "id=" + id +
      ", token='" + token + '\'' +
      ", createdDateTime=" + createdDateTime +
      ", disabledDateTime=" + disabledDateTime +
      ", disabled=" + disabled +
      ", attendance=" + attendances +
      '}';
  }
}
