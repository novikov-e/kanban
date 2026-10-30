package ru.taskmanger.service;

import ru.taskmanger.model.Project;
import java.util.UUID;

public interface ProjectService {
    Project getProjectById(UUID projectId);
    Project createProject(UUID userId, int position);
    void renameProject(UUID projectId, String name);
    void moveProject(UUID projectId, UUID previousUserId,
                     int previousPosition, UUID currentUserId, int currentPosition);
    void deleteProject(UUID projectId, UUID userId, int position);

}
