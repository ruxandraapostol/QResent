package com.project.qresent.repository;

import com.project.qresent.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
  Student findByLdap(String ldap);
}
