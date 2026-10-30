package ru.taskmanger.service;

import ru.taskmanger.model.Column;
import ru.taskmanger.model.TaskList;
import java.util.UUID;

public interface ColumnService {
    Column createColumn(UUID projectId, String columnName, int columnPosition);
    void renameColumn(UUID columnId, String columnName);
    void moveColumn(UUID columnId, UUID previousProjectId,
                    int previousPosition, UUID currentProjectId, int currentPosition);
    void deleteColumn(UUID columnId, UUID projectId, int columnPosition);

}
