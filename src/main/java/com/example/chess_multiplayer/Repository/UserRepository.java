package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByAccount_iDAcc(String idAcc);
}