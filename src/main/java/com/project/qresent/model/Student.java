package com.project.qresent.model;

import javax.persistence.*;

@Entity
public class Student {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String firstName;

  private String lastName;

  private String clazz;

  private String ldap;

  @Column(columnDefinition = "boolean default false", nullable = false)
  private boolean active;

  public Student() {
  }

  public Student(UserProfile user) {
    this.firstName = user.getFirstName();

    this.lastName = user.getLastName();

    this.clazz = user.getClazz();

    this.ldap = user.getLdap();
  }

  public Student(String ldap) {
    this.ldap = ldap;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getClazz() {
    return clazz;
  }

  public void setClazz(String clazz) {
    this.clazz = clazz;
  }

  public String getLdap() {
    return ldap;
  }

  public void setLdap(String ldap) {
    this.ldap = ldap;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  @Override
  public String toString() {
    return "Student{" +
            "id=" + id +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", clazz='" + clazz + '\'' +
            ", ldap='" + ldap + '\'' +
            ", active=" + active +
            '}';
  }
