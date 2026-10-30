package ru.taskmanger.service.implementation;

import org.springframework.stereotype.Service;
import ru.taskmanger.model.Task;
import ru.taskmanger.model.TaskList;
import ru.taskmanger.repository.jdbc.JdbcTaskDao;
import ru.taskmanger.repository.jdbc.JdbcTaskListDao;
import ru.taskmanger.service.TaskListService;
import java.util.UUID;

@Service
public class TaskListServiceImplementation implements TaskListService {

    JdbcTaskListDao jdbcTaskListDao;

    public TaskListServiceImplementation(JdbcTaskListDao jdbcTaskListDao) {
        this.jdbcTaskListDao = jdbcTaskListDao;
    }

    @Override
    public TaskList createTaskList(UUID columnId, String taskListName, int taskListPosition) {
        return jdbcTaskListDao.createTaskList(columnId, taskListName, taskListPosition);
    }

    @Override
    public void renameTaskList(UUID taskListId, String taskListName) {
        jdbcTaskListDao.updateTaskListName(taskListId, taskListName);
    }

    @Override
    public void changeTaskListColor(UUID taskListId, short taskListColor) {
        jdbcTaskListDao.updateTaskListColor(taskListId, taskListColor);
    }

    @Override
    public void moveTaskList(UUID taskListId, UUID previousColumnId,
                             int previousPosition, UUID currentColumnId, int currentPosition) {
        jdbcTaskListDao.moveTaskList(taskListId, previousColumnId, previousPosition, currentColumnId, currentPosition);
    }

    @Override
    public void deleteTaskList(UUID taskListId, UUID columnId, int taskListPosition) {
        jdbcTaskListDao.deleteTaskList(taskListId, columnId, taskListPosition);
    }
}
