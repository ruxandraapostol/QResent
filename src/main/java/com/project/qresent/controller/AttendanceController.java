package com.project.qresent.controller;

import com.project.qresent.repository.AttendanceRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/QResent")
public class AttendanceController {

  AttendanceRepository attendanceRepository;

  public AttendanceController(AttendanceRepository attendanceRepository) {
    this.attendanceRepository = attendanceRepository;
  }
}
