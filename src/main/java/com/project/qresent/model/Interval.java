package com.project.qresent.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Interval {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String date;

  private String hours;

  String subjectName;

  @OneToMany(cascade = CascadeType.REMOVE)
  private List<Token> tokenList;

  public Interval() {
    this.tokenList = new ArrayList<>();
  }

  public List<Token> getTokenList() {
    return tokenList;
  }

  public void setTokenList(List<Token> tokenList) {
    this.tokenList = tokenList;
  }

  public String getSubjectName() {
    return subjectName;
  }

  public void setSubjectName(String subjectName) {
    this.subjectName = subjectName;
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

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getHours() {
    return hours;
  }

  public void setHours(String hours) {
    this.hours = hours;
  }

  @Override
  public String toString() {
    return "Interval{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", date='" + date + '\'' +
      ", hours='" + hours + '\'' +
      ", subjectName='" + subjectName + '\'' +
      ", tokens=" + tokenList +
      '}';
  }
}
