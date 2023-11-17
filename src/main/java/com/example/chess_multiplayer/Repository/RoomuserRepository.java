package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomuserRepository extends JpaRepository<Roomuser, String> {
    Optional<Roomuser> findByUserAndRoom(User user, Room room);
}