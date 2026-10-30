package ru.taskmanger.service;

import ru.taskmanger.model.TaskList;

import java.util.UUID;

public interface TaskListService {
    TaskList createTaskList(UUID columnId, String taskListName, int taskListPosition);
    void renameTaskList(UUID taskListId, String taskListName);
    void changeTaskListColor(UUID taskListId, short taskListColor);
    void moveTaskList(UUID taskListId, UUID previousColumnId, int previousPosition, UUID currentColumnId, int currentPosition);
    void deleteTaskList(UUID taskListId, UUID columnId, int taskListPosition);

}
