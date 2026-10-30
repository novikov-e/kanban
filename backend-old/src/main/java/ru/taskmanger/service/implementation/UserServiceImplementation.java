package ru.taskmanger.service.implementation;

import org.springframework.stereotype.Service;
import ru.taskmanger.model.Project;
import ru.taskmanger.model.User;
import ru.taskmanger.repository.jdbc.JdbcProjectDao;
import ru.taskmanger.repository.jdbc.JdbcUserDao;
import ru.taskmanger.service.UserService;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class UserServiceImplementation implements UserService {

    JdbcUserDao jdbcUserDao;

    public UserServiceImplementation(JdbcUserDao jdbcUserDao) {
        this.jdbcUserDao = jdbcUserDao;
    }

    @Override
    public User getUser() {
        return jdbcUserDao.findUserByEmail("noved256@gmail.com");
    }

    @Override
    public void darkTheme(UUID userId, boolean darkTheme) {
        jdbcUserDao.updateTheme(userId, darkTheme);
    }

    @Override
    public void lastProject(UUID userId, UUID projectId) {
        jdbcUserDao.updateLastProject(userId, projectId);
    }

    @Override
    public void updateUser(UUID userId, String firstname, String lastname, LocalDate dateOfBirth, String sex) {
        jdbcUserDao.updateUserData(userId, firstname, lastname, dateOfBirth, sex);
    }

    @Override
    public void deleteUser(UUID userId) {

    }
}
