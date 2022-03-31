package com.project.qresent.repository;

import com.project.qresent.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface UserRepository extends JpaRepository<UserProfile, Long> {
  UserProfile findByLdap(String ldap);

  List<UserProfile> findAllByUserRole(String userRole);

  @Modifying
  @Transactional
  @Query("update UserProfile u set u.loggedIn = :loggedIn where u.ldap = :ldap")
  void updateLoggedIn(@Param(value = "ldap") String ldap, @Param(value = "loggedIn") boolean loggedIn);

  @Modifying
  @Transactional
  @Query("update UserProfile u set u.oldUserPassword = :oldUserPassword, u.userPassword = :userPassword where u.ldap = :ldap")
  void changePassword(@Param(value = "ldap") String ldap, @Param(value = "oldUserPassword") String oldUserPassword, @Param(value = "userPassword") String userPassword);
}
