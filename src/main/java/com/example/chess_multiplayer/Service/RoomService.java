package com.example.chess_multiplayer.Service;


import com.example.chess_multiplayer.Entity.Room;
import com.example.chess_multiplayer.Repository.RoomRepository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class RoomService {
    private RoomRepository roomRepository;
    public RoomRepository createRoom(){
        return roomRepository;
    }
}
