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

    public User createUser(User user){
        return userRepository.save(user);
    }

    public User getUserById(String idUser) {
        return userRepository.findById(idUser).orElse(null);
    }
    public String getIdUserByIdAcc(String idAcc){
        return userRepository.findByAccount_iDAcc(idAcc).getIDUser();
    }
}
