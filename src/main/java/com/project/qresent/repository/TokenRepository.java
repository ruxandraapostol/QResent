package com.project.qresent.repository;

import com.project.qresent.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {
  Token findByToken(String token);
}
