package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends JpaRepository<Friend, String> {
}