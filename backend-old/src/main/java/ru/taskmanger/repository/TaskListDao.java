package ru.taskmanger.repository;

import ru.taskmanger.model.TaskList;
import java.util.List;
import java.util.UUID;

public interface TaskListDao {
    TaskList createTaskList(UUID columnId, String taskListName, int taskListPosition);
    TaskList findTaskListById(UUID taskListId);
    List<UUID> getSortingTaskListsByColumnId(UUID columnId);
    void updateTaskListName(UUID taskListId, String taskListName);
    void updateTaskListColor(UUID taskListId, short taskListColor);
    void updateTaskListPosition(UUID taskListId, int taskListPosition);
    void updateTaskListColumnAndPosition(UUID taskListId, UUID columnId, int taskListPosition);
    void moveTaskList(UUID taskListId, UUID previousColumn,
                      int previousPosition, UUID currentColumn, int currentPosition);
    void deleteTaskList(UUID taskListId, UUID columnId, int taskListPosition);
}
