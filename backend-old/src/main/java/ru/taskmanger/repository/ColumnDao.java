package ru.taskmanger.repository;

import ru.taskmanger.model.Column;
import java.util.List;
import java.util.UUID;

public interface ColumnDao {
    Column createColumn(UUID projectId, String columnName, int columnPosition);
    Column findColumnById(UUID columnId);
    List<UUID> getSortingColumnsByProjectId(UUID projectId);
    void updateColumnName(UUID columnId, String columnName);
    void updateColumnPosition(UUID columnId, int columnPosition);
    void updateColumnProjectAndPosition(UUID columnId, UUID projectId, int columnPosition);
    void moveColumn(UUID columnId, UUID previousProject,
                    int previousPosition, UUID currentProject, int currentPosition);
    void deleteColumn(UUID columnId, UUID projectId, int columnPosition);
}
