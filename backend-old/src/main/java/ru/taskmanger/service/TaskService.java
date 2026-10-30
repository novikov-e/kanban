package ru.taskmanger.service;

import ru.taskmanger.model.Task;
import java.util.UUID;

public interface TaskService {
    Task createTask(UUID TaskListId, String taskName, int taskPosition);
    void renameTask(UUID taskId, String taskName);
    void changeTaskState(UUID taskId, boolean taskState);
    void moveTask(UUID taskId, UUID previousTaskList, int previousPosition, UUID currentTaskList, int currentPosition);
    void deleteTask(UUID taskId, UUID taskListId, int taskPosition);
}
