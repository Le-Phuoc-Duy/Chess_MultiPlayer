package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.Roomuser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomuserRepository extends JpaRepository<Roomuser, String> {
    Optional<Roomuser> findByRoomIdAndUserId(String idRoom, String idUser);
}