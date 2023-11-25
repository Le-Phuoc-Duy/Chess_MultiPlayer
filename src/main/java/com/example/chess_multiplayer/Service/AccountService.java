package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.Entity.Account;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    public Account createAccount(Account account){
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        return accountRepository.save(account);
    }
    public boolean authenticate(String username, String password) {
        Account account = accountRepository.findByUsername(username);

        if (account == null) {
            return false;
        }

        if (passwordEncoder.matches(password, account.getPassword())) {
            return true;
        }

        return false;
    }

    public String getAccID(String username, String password){
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            return null;
        }
        if (passwordEncoder.matches(password, account.getPassword())) {
            return account.getiDAcc();
        }
        return null;
    }

    public boolean isUsernameExists(String username) {
        return accountRepository.existsByUsername(username);
    }
}
