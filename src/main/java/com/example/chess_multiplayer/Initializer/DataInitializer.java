package com.example.chess_multiplayer.Initializer;


import com.example.chess_multiplayer.Entity.Account;
import com.example.chess_multiplayer.Entity.Friend;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.FriendRepository;
import com.example.chess_multiplayer.Service.AccountService;
import com.example.chess_multiplayer.Service.FriendService;
import com.example.chess_multiplayer.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class DataInitializer implements ApplicationRunner {
    @Autowired
    private AccountService accountService;
    @Autowired
    private UserService userService;
    @Autowired
    private FriendService friendService;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        try {
            // Tạo đối tượng User
            User user1 = new User();
            user1.setIDUser("use01");
            user1.setAva(1);
            user1.setElo(1200);
            user1.setWin(10);
            user1.setLose(5);
            user1.setDraw(2);
            // Tạo đối tượng Account
            Account account1 = new Account();
            account1.setiDAcc("Acc01");
            account1.setUsername("user1_username");
            account1.setPassword("user1_password");

            // Thiết lập liên kết 1-1
            accountService.createAccount(account1);
            user1.setAccount(account1);
            // Thiet lap lien ket 1-nhieu
            user1.setRoomusers(new HashSet<>());
            user1.setFriends(new HashSet<>());

            // Lưu vào cơ sở dữ liệu
            userService.createUser(user1);

            // Tạo đối tượng User
            User user2 = new User();
            user2.setIDUser("use02");
            user2.setAva(2);
            user2.setElo(1300);
            user2.setWin(8);
            user2.setLose(6);
            user2.setDraw(3);
            // Tạo đối tượng Account
            Account account2 = new Account();
            account2.setiDAcc("Acc02");
            account2.setUsername("user2_username");
            account2.setPassword("user2_password");

            // Thiết lập liên kết 1-1
            accountService.createAccount(account2);
            user2.setAccount(account2);
            // Thiet lap lien ket 1-nhieu
            user2.setRoomusers(new HashSet<>());
            user2.setFriends(new HashSet<>());

            // Lưu vào cơ sở dữ liệu
            userService.createUser(user2);

            // Tạo đối tượng User
            User user3 = new User();
            user3.setIDUser("use03");
            user3.setAva(4);
            user3.setElo(1000);
            user3.setWin(4);
            user3.setLose(6);
            user3.setDraw(6);
            // Tạo đối tượng Account
            Account account3 = new Account();
            account3.setiDAcc("Acc03");
            account3.setUsername("123");
            account3.setPassword("123");

            // Thiết lập liên kết 1-1
            accountService.createAccount(account3);
            user3.setAccount(account3);
            // Thiet lap lien ket 1-nhieu
            user3.setRoomusers(new HashSet<>());
            user3.setFriends(new HashSet<>());

            // Lưu vào cơ sở dữ liệu
            userService.createUser(user3);

            // Tạo đối tượng User
            User user4 = new User();
            user4.setIDUser("use04");
            user4.setAva(4);
            user4.setElo(1000);
            user4.setWin(4);
            user4.setLose(6);
            user4.setDraw(6);
            // Tạo đối tượng Account
            Account account4 = new Account();
            account4.setiDAcc("Acc04");
            account4.setUsername("1234");
            account4.setPassword("1234");

            // Thiết lập liên kết 1-1
            accountService.createAccount(account4);
            user4.setAccount(account4);
            // Thiet lap lien ket 1-nhieu
            user4.setRoomusers(new HashSet<>());
            user4.setFriends(new HashSet<>());

            // Lưu vào cơ sở dữ liệu
            userService.createUser(user4);

            // Tạo đối tượng friend
            Friend friend12 = new Friend();
            friend12.setId("fr001");
            friend12.setUser(user1);
            friend12.setFriend(user2);

            Friend friend21 = new Friend();
            friend21.setId("fr002");
            friend21.setUser(user2);
            friend21.setFriend(user1);

            Friend friend13 = new Friend();
            friend13.setId("fr003");
            friend13.setUser(user1);
            friend13.setFriend(user3);

            Friend friend31 = new Friend();
            friend31.setId("fr004");
            friend31.setUser(user3);
            friend31.setFriend(user1);

            Friend friend34 = new Friend();
            friend34.setId("fr005");
            friend34.setUser(user3);
            friend34.setFriend(user4);

            Friend friend43 = new Friend();
            friend43.setId("fr006");
            friend43.setUser(user4);
            friend43.setFriend(user3);

            // Lưu vào cơ sở dữ liệu
            friendService.createFriend(friend12);
            friendService.createFriend(friend21);
            friendService.createFriend(friend13);
            friendService.createFriend(friend31);
            friendService.createFriend(friend34);
            friendService.createFriend(friend43);

        } catch (Exception exception) {
            exception.printStackTrace();
        }

    }
}
