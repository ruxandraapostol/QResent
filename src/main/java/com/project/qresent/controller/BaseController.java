package com.project.qresent.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/QResent")
@RestController
public class BaseController {

  @RequestMapping(value = "/test", method = RequestMethod.GET)
  public String getTest() {
    return "it's working";
  }
}
