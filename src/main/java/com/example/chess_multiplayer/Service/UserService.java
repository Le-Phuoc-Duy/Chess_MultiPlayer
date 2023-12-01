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
import java.util.Random;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountService accountService;
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
    public String registerUser(String username, String password, int ava){
        User user1 = new User();
        user1.setIDUser(generateUniqueRandomIdUser());
        user1.setAva(ava);
        user1.setElo(1000);
        user1.setWin(0);
        user1.setLose(0);
        user1.setDraw(0);
        // Tạo đối tượng Account
        Account account1 = new Account();
        account1.setiDAcc(generateUniqueRandomIdAcc());
        account1.setUsername(username);
        account1.setPassword(password);
        // Thiết lập liên kết 1-1
        accountService.createAccount(account1);
        user1.setAccount(account1);
        // Thiet lap lien ket 1-nhieu
        user1.setRoomusers(new HashSet<>());
        user1.setFriends(new HashSet<>());

        // Lưu vào cơ sở dữ liệu
        this.createUser(user1);
        return user1.getIDUser();
    }
    private String generateUniqueRandomIdUser() {
        Random random = new Random();
        StringBuilder idUserBuilder;
        do {
            idUserBuilder = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                // Sử dụng ký tự từ 0-9a-zA-Z
                char randomChar = (char) (random.nextInt(62) + 48);
                idUserBuilder.append(randomChar);
            }
        } while (userRepository.existsById(idUserBuilder.toString()));

        return idUserBuilder.toString();
    }
    private String generateUniqueRandomIdAcc() {
        Random random = new Random();
        StringBuilder idAccBuilder;

        do {
            idAccBuilder = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                // Sử dụng ký tự từ 0-9a-zA-Z
                char randomChar = (char) (random.nextInt(62) + 48);
                idAccBuilder.append(randomChar);
            }
        } while (accountRepository.existsById(idAccBuilder.toString()));

        return idAccBuilder.toString();
    }
    public void updateUserWinAndElo(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setWin(user.getWin() + 1);
            user.setElo(user.getElo() + 50);
            userRepository.save(user);
        }
    }
    public void updateUserLoseAndElo(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setLose(user.getLose() + 1);
            user.setElo(user.getElo() - 50);
            userRepository.save(user);
        }
    }
    public void updateUserDrawAndElo(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setDraw(user.getDraw() + 1);
            user.setElo(user.getElo() + 10);
            userRepository.save(user);
        }
    }
}
