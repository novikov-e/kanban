package ru.taskmanger.service;

import ru.taskmanger.model.Project;
import ru.taskmanger.model.User;
import java.time.LocalDate;
import java.util.UUID;

public interface UserService {
    User getUser();
    void darkTheme(UUID userId, boolean darkTheme);
    void lastProject(UUID userId, UUID projectId);
    void updateUser(UUID userId, String firstname, String lastname, LocalDate dateOfBirth, String sex);

    void deleteUser(UUID userId);


}
