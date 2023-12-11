package com.example.chess_multiplayer.Repository;

import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Entity.Roomuser;
import com.example.chess_multiplayer.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomuserRepository extends JpaRepository<Roomuser, String> {
    Optional<Roomuser> findByUserAndRoom(User user, Room room);
    @Query("SELECT r.side FROM Roomuser r WHERE r.user.iDUser = :userId AND r.room.IDRoom = :roomId")
    boolean findSideByRoomIdAndUserId(String roomId, String userId);

}