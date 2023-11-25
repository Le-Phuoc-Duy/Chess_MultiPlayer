package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.Account;
import com.example.chess_multiplayer.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByUsername(String username);
    Account findByUser(User user);
    boolean existsByUsername(String username);
}