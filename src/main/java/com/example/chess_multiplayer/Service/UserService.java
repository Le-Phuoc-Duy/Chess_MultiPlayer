package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.Entity.Account;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.AccountRepository;
import com.example.chess_multiplayer.Repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    public User createUser(User user){
        return userRepository.save(user);
    }

    public User getUserById(String idUser) {
        return userRepository.findById(idUser).orElse(null);
    }
    public String getIdUserByIdAcc(String idAcc){
        return userRepository.findByAccount_iDAcc(idAcc).getIDUser();
    }
    public String getUsernameByUserID(String userID) {
        User user = userRepository.findById(userID).orElse(null);
        if (user != null) {
            Account account = accountRepository.findByUser(user);
            if (account != null) {
                return account.getUsername();
            }
        }
        return null; // Or throw an exception indicating user or account not found
    }

}
