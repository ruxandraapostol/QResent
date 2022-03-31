package com.project.qresent.controller;

import com.project.qresent.model.*;
import com.project.qresent.repository.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
public class TokenController {

  TokenRepository tokenRepository;

  SubjectRepository subjectRepository;

  AttendanceRepository attendanceRepository;

  StudentRepository studentRepository;

  IntervalRepository intervalRepository;


  public TokenController(TokenRepository tokenRepository,
                         SubjectRepository subjectRepository,
                         AttendanceRepository attendanceRepository,
                         StudentRepository studentRepository,
                         IntervalRepository intervalRepository) {
    this.tokenRepository = tokenRepository;
    this.subjectRepository = subjectRepository;
    this.attendanceRepository = attendanceRepository;
    this.studentRepository = studentRepository;
    this.intervalRepository = intervalRepository;
  }

  @GetMapping("/getToken/{subjectName}/{intervalName}")
  public String getToken(@PathVariable String subjectName, @PathVariable String intervalName) {
    Subject getSubject = subjectRepository.findByName(subjectName);
    Interval getInterval = intervalRepository.findIntervalByNameAndSubjectName(intervalName, subjectName);

    if (getSubject != null && getInterval != null) {
      Token token = new Token();

      tokenRepository.save(token);

      getInterval.getTokenList().add(token);
      intervalRepository.save(getInterval);

      return token.getToken();
    } else {
      return "The subject or interval doesn't exist!";
    }
  }

  @GetMapping("/disableToken/{token}")
  public String disableToken(@PathVariable String token) {
    Token getToken = this.tokenRepository.findByToken(token);

    if (getToken != null) {
      getToken.disableToken();
      this.tokenRepository.save(getToken);

      return "Token disabled!";
    }

    return "Token doesn't exist!";
  }

  @GetMapping("/deleteToken/{token}")
  public String deleteToken(@PathVariable String token) {
    this.tokenRepository.delete(this.tokenRepository.findByToken(token));

    return "Token deleted!";
  }

  @PostMapping(value = "/scannedQR/{token}", consumes = MediaType.TEXT_PLAIN_VALUE)
  public String scannedQR(@PathVariable String token, @RequestBody String studentLdap) {
    Token getToken = this.tokenRepository.findByToken(token);

    if (getToken != null) {

      Attendance attendance = new Attendance();
      attendance.setScannedDateTime(LocalDateTime.now());

      Student dbStudent = studentRepository.findByLdap(studentLdap);
      if (dbStudent == null) {
        return "Student doesn't exist!";
      }

      if (!getToken.attendanceListContainsUser(dbStudent.getLdap()) && !getToken.isDisabled()) {
        attendance.setStudent(dbStudent);
        attendanceRepository.save(attendance);

        getToken.setScannedCount(getToken.getScannedCount() + 1);
        getToken.getAttendances().add(attendance);
        tokenRepository.save(getToken);

        return "Your attendance has been registered successfully!";
      }


      return "The token expired or you registered your attendance previously!";
    } else {
      return "The token expired!";
    }
  }

  @GetMapping("/QResent/getAttendanceList/{subjectName}/{intervalName}")
  public List<Student> getAttendanceList(@PathVariable String subjectName, @PathVariable String intervalName) {
    Interval getInterval = intervalRepository.findIntervalByNameAndSubjectName(intervalName, subjectName);
    Set<Student> studentSet = new HashSet<>();
    List<Student> fullStudentList = new ArrayList<>();

    if (getInterval != null) {
      for (Token token : getInterval.getTokenList()) {
        for (Attendance attendance : token.getAttendances()) {
          studentSet.add(attendance.getStudent());
          fullStudentList.add(attendance.getStudent());
        }
      }
    } else {
      return null;
    }

    List<Student> studentList = new ArrayList<>(studentSet);
    for (ListIterator<Student> iterator = studentList.listIterator(); iterator.hasNext(); ) {
      Student currentStudent = iterator.next();

      int noOfScans = Collections.frequency(fullStudentList, currentStudent);
      if (noOfScans >= 2) {
        iterator.remove();
        currentStudent.setActive(true);
        iterator.add(currentStudent);
      }
    }

    return studentList;
  }

  @GetMapping("/QResent/getTokenScannedCount/{token}")
  public Integer getTokenAttendanceList(@PathVariable String token) {
    Token getToken = tokenRepository.findByToken(token);

    if (getToken != null) {
      return getToken.getScannedCount();
    }

    return -1;
  }
}