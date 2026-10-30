package ru.taskmanger.repository;

import ru.taskmanger.model.Project;
import java.util.List;
import java.util.UUID;

public interface ProjectDao {
    Project createProject(UUID userId, String projectName, int projectPosition);
    Project findProjectByID(UUID projectId);
    Project findProjectByIdWithColumns(UUID projectId);
    List<UUID> getSortingProjectsByUserId(UUID userId);
    void updateProjectName(UUID projectId, String projectName);
    void updateProjectPosition(UUID projectId, int projectPosition);
    void updateProjectUserAndPosition(UUID projectId, UUID userId, int projectPosition);
    void moveProject(UUID projectId, UUID previousUserId,
                     int previousPosition, UUID currentUserId, int currentPosition);
    void deleteProject(UUID projectId, UUID userId, int projectPosition);
}
