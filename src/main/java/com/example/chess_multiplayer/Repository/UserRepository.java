package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByAccount_iDAcc(String idAcc);
    @Query("SELECT u FROM User u ORDER BY u.elo DESC, u.iDUser DESC")
    Page<User> findAllByOrderByEloDesc(Pageable pageable);
    @Query("SELECT COUNT(u) + 1 FROM User u WHERE u.elo > (SELECT u2.elo FROM User u2 WHERE u2.iDUser = :iDUser)")
    int getRank(@Param("iDUser") String iDUser);
}