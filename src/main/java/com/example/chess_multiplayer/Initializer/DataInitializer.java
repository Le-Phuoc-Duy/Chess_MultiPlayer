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
        try{
            User user1 = new User();
            user1.setIDUser("use01");
            user1.setAva(1);
            user1.setElo(1200);
            user1.setWin(10);
            user1.setLose(5);
            user1.setDraw(2);
            // Tạo đối tượng Account
            Account account1 = new Account();
            account1.setiDAccount("Acc01");
            account1.setUsername("user1_username");
            account1.setPassword("user1_password");
            // Thiết lập liên kết 1-1
            user1.setAccount(account1);
            account1.setUser(user1);
            // Thiet lap lien ket 1-nhieu

            user1.setRoomusers(new HashSet<>());

            User user2 = new User();
            user2.setIDUser("use02");
            user2.setAva(2);
            user2.setElo(1300);
            user2.setWin(8);
            user2.setLose(6);
            user2.setDraw(3);

            Account account2 = new Account();
            account2.setiDAccount("Acc02");
            account2.setUsername("user2_username");
            account2.setPassword("user2_password");
            // Thiết lập liên kết 1-1
            user2.setAccount(account2);
            account2.setUser(user2);
            // Thiet lap lien ket 1-nhieu
            user2.setRoomusers(new HashSet<>());

            User user3 = new User();
            user3.setIDUser("use03");
            user3.setAva(4);
            user3.setElo(1000);
            user3.setWin(4);
            user3.setLose(6);
            user3.setDraw(6);

            Account account3 = new Account();
            account3.setiDAccount("Acc03");
            account3.setUsername("user3_username");
            account3.setPassword("user3_password");
            // Thiết lập liên kết 1-1
            user3.setAccount(account3);
            account3.setUser(user3);
            // Thiet lap lien ket 1-nhieu
            user3.setRoomusers(new HashSet<>());

            User user4 = new User();
            user4.setIDUser("use04");
            user4.setAva(4);
            user4.setElo(1000);
            user4.setWin(4);
            user4.setLose(6);
            user4.setDraw(6);

            Account account4 = new Account();
            account4.setiDAccount("Acc04");
            account4.setUsername("user4_username");
            account4.setPassword("user4_password");
            // Thiết lập liên kết 1-1
            user4.setAccount(account4);
            account4.setUser(user4);
            // Thiet lap lien ket 1-nhieu
            user4.setRoomusers(new HashSet<>());

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
            HashSet<Friend> friendHashSet1 = new HashSet<>();
            friendHashSet1.add(friend12);
            friendHashSet1.add(friend13);
            HashSet<Friend> friendHashSet2 = new HashSet<>();
            friendHashSet2.add(friend21);
            HashSet<Friend> friendHashSet3 = new HashSet<>();
            friendHashSet3.add(friend31);
            friendHashSet3.add(friend34);
            HashSet<Friend> friendHashSet4 = new HashSet<>();
            friendHashSet4.add(friend43);

            // Duyệt qua danh sách bạn và thêm bạn vào `HashSet` của mỗi người dùng.
            user1.setFriends(friendHashSet1);
            user2.setFriends(friendHashSet2);
            user3.setFriends(friendHashSet3);
            user4.setFriends(friendHashSet4);

            // Lưu vào cơ sở dữ liệu
            userService.createUser(user1);
            accountService.createAccount(account1);
            userService.createUser(user2);
            accountService.createAccount(account2);
            userService.createUser(user3);
            accountService.createAccount(account3);
            userService.createUser(user4);
            accountService.createAccount(account4);
            friendService.createFriend(friend12);
            friendService.createFriend(friend21);
            friendService.createFriend(friend13);
            friendService.createFriend(friend31);
            friendService.createFriend(friend34);
            friendService.createFriend(friend43);
        }catch (Exception exception){
            exception.printStackTrace();
        }

    }
}
