package ru.taskmanger.service.implementation;

import org.springframework.stereotype.Service;
import ru.taskmanger.model.Column;
import ru.taskmanger.model.Project;
import ru.taskmanger.repository.jdbc.JdbcColumnDao;
import ru.taskmanger.repository.jdbc.JdbcProjectDao;
import ru.taskmanger.service.ProjectService;
import java.util.UUID;

@Service
public class ProjectServiceImplementation implements ProjectService {

    JdbcProjectDao jdbcProjectDao;

    public ProjectServiceImplementation(JdbcProjectDao jdbcProjectDao) {
        this.jdbcProjectDao = jdbcProjectDao;
    }

    @Override
    public Project getProjectById(UUID projectId) {
        return jdbcProjectDao.findProjectByIdWithColumns(projectId);
    }

    @Override
    public Project createProject(UUID userId, int position) {
        return jdbcProjectDao.createProject(userId, "Новый проект", position);
    }

    @Override
    public void renameProject(UUID projectId, String name) {
        jdbcProjectDao.updateProjectName(projectId, name);
    }

    @Override
    public void moveProject(UUID projectId, UUID previousUserId, int previousPosition, UUID currentUserId, int currentPosition) {
        jdbcProjectDao.moveProject(projectId, previousUserId, previousPosition, currentUserId, currentPosition);
    }

    @Override
    public void deleteProject(UUID projectId, UUID userId,  int position) {
        jdbcProjectDao.deleteProject(projectId, userId, position);
    }
}
