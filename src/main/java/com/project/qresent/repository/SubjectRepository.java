package com.project.qresent.repository;

import com.project.qresent.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
  List<Subject> findByProfessorLdap(String ldap);

  Subject findByName(String name);
}
