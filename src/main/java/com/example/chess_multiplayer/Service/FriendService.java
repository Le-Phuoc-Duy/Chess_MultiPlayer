package com.example.chess_multiplayer.Service;

import com.example.chess_multiplayer.DTO.FriendReponse;
import com.example.chess_multiplayer.Entity.Friend;
import com.example.chess_multiplayer.Entity.User;
import com.example.chess_multiplayer.Repository.FriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class FriendService {
    @Autowired
    private FriendRepository friendRepository;
    public Friend createFriend(Friend friend){
        return friendRepository.save(friend);
    }
    private String generateUniqueRandomId() {
        Random random = new Random();
        StringBuilder idUserBuilder;
        do {
            idUserBuilder = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                // Sử dụng ký tự từ 0-9a-zA-Z
                char randomChar = (char) (random.nextInt(62) + 48);
                idUserBuilder.append(randomChar);
            }
        } while (friendRepository.existsById(idUserBuilder.toString()));

        return idUserBuilder.toString();
    }
    public void acceptInvitation(User userInvite, User userInvited){
        Friend friend = new Friend();
        friend.setFriend(userInvite);
        friend.setUser(userInvited);
        friend.setId(generateUniqueRandomId());
        createFriend(friend);

        friend.setFriend(userInvited);
        friend.setUser(userInvite);
        friend.setId(generateUniqueRandomId());
        createFriend(friend);
    }
    public boolean isExistFriend(User userInvite, User userInvited){
        if (!friendRepository.existsByUserAndFriend(userInvite, userInvited))
            return false;
        return true;
    }
    public ArrayList<String> getListFriend(User user) {
        ArrayList<String> friendIds = friendRepository.findAllByFriendByUser(user);
        return friendIds;
    }
}
