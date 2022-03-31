package com.project.qresent.controller;

import com.project.qresent.model.Student;
import com.project.qresent.model.UserProfile;
import com.project.qresent.pojo.Profile;
import com.project.qresent.repository.StudentRepository;
import com.project.qresent.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/QResent")
public class UserController {

  UserRepository userRepository;
  StudentRepository studentRepository;

  public UserController(UserRepository userRepository, StudentRepository studentRepository) {
    this.userRepository = userRepository;
    this.studentRepository = studentRepository;
  }

  @GetMapping("/users")
  public List<UserProfile> getAllUsers() {
    List<UserProfile> allUsers = this.userRepository.findAll();

    // Remove passwords from response :)
    for (UserProfile user : allUsers) {
      if (user != null) {
        user.setUserPassword("");
        user.setOldUserPassword("");
      }
    }

    return allUsers;
  }

  @GetMapping("/getUserByLdap/{ldap:.+}")
  public UserProfile getUserByLdap(@PathVariable String ldap) {
    UserProfile user = this.userRepository.findByLdap(ldap);

    // Remove passwords from response :)
    if (user != null) {
      user.setUserPassword("");
      user.setOldUserPassword("");
    }

    return user;
  }

  @PostMapping(value = {"/addUser", "/addStudent"}, consumes = MediaType.APPLICATION_JSON_VALUE)
  public String addUser(@RequestBody UserProfile user) {
    this.userRepository.save(user);

    if (user.getUserRole().equals("s")) {
      this.studentRepository.save(new Student(user));
    }

    return user + " added";
  }

  @RequestMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
  public Object loginUser(@RequestBody UserProfile user) {
    if (this.userRepository.findByLdap(user.getLdap()) == null) {
      return "User doesn't exist!";
    }

    String dbPassword = this.userRepository.findByLdap(user.getLdap()).getUserPassword();
    if (dbPassword == null) {
      return "User or password incorrect!";
    } else {
      if (dbPassword.equals(user.getUserPassword())) {
        this.userRepository.updateLoggedIn(user.getLdap(), true);

        return new Profile(user.getLdap(), this.userRepository.findByLdap(user.getLdap()).getUserRole());
      } else {
        return "User or password incorrect!";
      }
    }
  }

  @RequestMapping(value = "/logout", consumes = MediaType.APPLICATION_JSON_VALUE)
  public String logoutUser(@RequestBody UserProfile user) {
    this.userRepository.updateLoggedIn(user.getLdap(), false);

    return "The user " + user.getLdap() + " logged out!";
  }

  @PostMapping(value = "/changePassword", consumes = MediaType.APPLICATION_JSON_VALUE)
  public String changePass(@RequestBody UserProfile user) {
    String dbPassword = this.userRepository.findByLdap(user.getLdap()).getUserPassword();
    Boolean loggedIn = this.userRepository.findByLdap(user.getLdap()).getLoggedIn();

    if (dbPassword.equals(user.getOldUserPassword()) && loggedIn) {
      this.userRepository.changePassword(user.getLdap(), dbPassword, user.getUserPassword());

      return "The password has been changed successfully!";
    } else {
      return "The current password is not correct!";
    }
  }

  @DeleteMapping(value = "/deleteUser", consumes = MediaType.APPLICATION_JSON_VALUE)
  public String deleteUser(@RequestBody UserProfile user) {
    UserProfile userProfile = this.userRepository.findByLdap(user.getLdap());
    Student student = this.studentRepository.findByLdap(user.getLdap());

    if (userProfile == null) {
      return "User doesn't exist!";
    } else {
      this.userRepository.delete(userProfile);

      if (student != null) {
        this.studentRepository.delete(student);
      }

      return "User has been deleted successfully!";
    }
  }

  @PutMapping(value = "/updateUser/{ldap:.+}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public String updateUser(@PathVariable String ldap, @RequestBody UserProfile user) {
    UserProfile userToUpdate = this.userRepository.findByLdap(ldap);

    if (userToUpdate == null) {
      return "User not found";
    }

    Student studentToUpdate = null;
    if (userToUpdate.getUserRole().equals("s")) {
      studentToUpdate = this.studentRepository.findByLdap(user.getLdap());
    }

    if (user.getUserRole() != null) {
      userToUpdate.setUserRole(user.getUserRole());
    }

    if (user.getFirstName() != null) {
      userToUpdate.setFirstName(user.getFirstName());

      if (studentToUpdate != null) {
        studentToUpdate.setFirstName(user.getFirstName());
      }
    }

    if (user.getLastName() != null) {
      userToUpdate.setLastName(user.getLastName());

      if (studentToUpdate != null) {
        studentToUpdate.setLastName(user.getFirstName());
      }
    }

    if (user.getClazz() != null) {
      userToUpdate.setClazz(user.getClazz());

      if (studentToUpdate != null) {
        studentToUpdate.setClazz(user.getClazz());
      }
    }

    if (user.getContact() != null) {
      userToUpdate.setContact(user.getContact());
    }

    if (user.getCurrentYear() != null) {
      userToUpdate.setCurrentYear(user.getCurrentYear());
    }

    if (studentToUpdate != null) {
      this.studentRepository.save(studentToUpdate);
    }

    this.userRepository.save(userToUpdate);

    return "User has been edited successfully";
  }

  @GetMapping("/professors")
  public List<UserProfile> getAllProfessors() {
    List<UserProfile> allProfessors = this.userRepository.findAllByUserRole("p");

    // Remove passwords from response :)
    for (UserProfile user : allProfessors) {
      if (user != null) {
        user.setUserPassword("");
        user.setOldUserPassword("");
      }
    }

    return allProfessors;
  }

  @RequestMapping("/getProfessorByLdap/{ldap:.+}")
  public UserProfile getProfessorByLdap(@PathVariable String ldap) {
    return this.userRepository.findByLdap(ldap);
  }

  @PostMapping(value = "/addProfessor", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> addProfessor(@RequestBody UserProfile professor) {
    professor.setUserRole("p");

    this.userRepository.save(professor);

    return ResponseEntity.ok(professor + " added");
  }
}
