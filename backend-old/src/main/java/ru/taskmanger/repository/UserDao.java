package ru.taskmanger.repository;

import ru.taskmanger.model.User;
import java.time.LocalDate;
import java.util.UUID;

public interface UserDao {
    UUID createUser(String email, String password);
    User findUserByEmail(String email);
    void updateEmail(UUID userId, String email);
    void updatePassword(UUID userId, String password);
    void updateUserData(UUID userId, String firstname, String lastname, LocalDate dateOfBirth, String sex);
    void updateImage(UUID userId, String imageUrl);
    void updateTheme(UUID userId, boolean darkTheme);
    void updateLastProject(UUID userId, UUID projectId);
    void deleteUser(UUID userId);
}
