package ru.taskmanger.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.taskmanger.dto.CreateObjectDto;
import ru.taskmanger.dto.DeleteObjectDto;
import ru.taskmanger.dto.MoveDto;
import ru.taskmanger.dto.RenameDto;
import ru.taskmanger.model.Project;
import ru.taskmanger.service.implementation.ProjectServiceImplementation;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/project")
public class ProjectRestControllerV1 {

    final ProjectServiceImplementation projectService;

    @Autowired
    public ProjectRestControllerV1(ProjectServiceImplementation projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<Project> getProject(HttpServletRequest request) {
        String id = request.getParameter("id");
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Project project = this.projectService.getProjectById(UUID.fromString(id));
        if (project == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Project> lastProject(@RequestBody CreateObjectDto createProjectDto) {
        Project project = projectService.createProject(
                createProjectDto.getParentObjectId(), createProjectDto.getPosition());
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PostMapping("/rename")
    public ResponseEntity<Project> renameProject(@RequestBody RenameDto renameDto) {
        projectService.renameProject(renameDto.getObjectId(), renameDto.getName());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/move")
    public ResponseEntity<Project> moveProject(@RequestBody MoveDto moveDto) {
        projectService.moveProject(moveDto.getMovedObjectId(), moveDto.getPreviousParentObject(),
                moveDto.getPreviousPosition(), moveDto.getCurrentParentObject(), moveDto.getCurrentPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<Project> deleteProject(@RequestBody DeleteObjectDto deleteObjectDto) {
        projectService.deleteProject(deleteObjectDto.getObjectId(),
                deleteObjectDto.getParentObjectId(), deleteObjectDto.getPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
