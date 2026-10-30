package ru.taskmanger.repository;

import ru.taskmanger.model.Task;
import java.util.List;
import java.util.UUID;

public interface TaskDao {
    Task createTask(UUID taskListId, String taskName, int taskPosition);
    Task findTaskById(UUID taskId);
    List<UUID> getSortingTasksByTaskListId(UUID taskListId);
    void updateTaskName(UUID taskId, String taskName);
    void updateTaskPosition(UUID taskId, int taskPosition);
    void updateTaskState(UUID taskId, boolean taskState);
    void updateTaskTaskListAndPosition(UUID taskId, UUID taskListId, int taskPosition);
    void moveTask(UUID taskId, UUID previousTaskListId,
                  int previousPosition, UUID currentTaskListId, int currentPosition);
    void deleteTask(UUID taskId, UUID taskListId, int taskPosition);

}
