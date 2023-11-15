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
    private UserService userService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    public void addAccountData() {

    }

    public Account createAccount(Account account){
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        return accountRepository.save(account);
    }
//    public boolean authenticate(String inputPassword, String encodedPassword) {
//        return passwordEncoder.matches(inputPassword, encodedPassword);
//    }
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
    public String getUserIDbyAccountID(String accID){
        Account account = accountRepository.findById(accID).orElse(null);
        if (account != null){
            return account.getUser().getIDUser();
        }else{
            return null;
        }

    }
    public String getUserID(String username, String password){
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            return null;
        }
        if (passwordEncoder.matches(password, account.getPassword())) {
            return account.getiDAccount();
        }
        return null;
    }
}
