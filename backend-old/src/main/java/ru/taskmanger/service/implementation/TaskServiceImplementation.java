package ru.taskmanger.service.implementation;

import org.springframework.stereotype.Service;
import ru.taskmanger.model.Task;
import ru.taskmanger.repository.jdbc.JdbcTaskDao;
import ru.taskmanger.service.TaskService;
import java.util.UUID;

@Service
public class TaskServiceImplementation implements TaskService {

    JdbcTaskDao jdbcTaskDao;

    public TaskServiceImplementation(JdbcTaskDao jdbcTaskDao) {
        this.jdbcTaskDao = jdbcTaskDao;
    }

    @Override
    public Task createTask(UUID taskListId, String taskName, int taskPosition) {
        return jdbcTaskDao.createTask(taskListId, taskName, taskPosition);
    }

    @Override
    public void renameTask(UUID taskId, String taskName) {
        jdbcTaskDao.updateTaskName(taskId, taskName);
    }

    @Override
    public void changeTaskState(UUID taskId, boolean taskState) {
        jdbcTaskDao.updateTaskState(taskId, taskState);
    }

    @Override
    public void moveTask(UUID taskId, UUID previousTaskList, int previousPosition, UUID currentTaskList, int currentPosition) {
        jdbcTaskDao.moveTask(taskId, previousTaskList, previousPosition, currentTaskList, currentPosition);
    }

    @Override
    public void deleteTask(UUID taskId, UUID taskListId, int taskPosition) {
        jdbcTaskDao.deleteTask(taskId, taskListId, taskPosition);
    }
}
