package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.Entity.Friend;
import com.example.chess_multiplayer.Repository.FriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendService {
    @Autowired
    private FriendRepository friendRepository;
    public Friend createFriend(Friend friend){
        return friendRepository.save(friend);
    }

}
