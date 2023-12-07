package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.Friend;
import com.example.chess_multiplayer.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, String> {
    boolean existsByUserAndFriend(User user, User friend);

    @Query("SELECT f.friend.iDUser FROM Friend f WHERE f.user = :user")
    ArrayList<String> findAllByFriendByUser(User user);
}