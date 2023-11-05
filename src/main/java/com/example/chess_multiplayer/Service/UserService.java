package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.Entity.Account;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public void addUserData(){

    }
    public User createUser(User user){
        return userRepository.save(user);
    }

}
