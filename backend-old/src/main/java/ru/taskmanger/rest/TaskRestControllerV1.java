package ru.taskmanger.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.taskmanger.dto.*;
import ru.taskmanger.model.Column;
import ru.taskmanger.model.Project;
import ru.taskmanger.model.Task;
import ru.taskmanger.service.implementation.TaskServiceImplementation;

@RestController
@RequestMapping("/api/v1/task")
public class TaskRestControllerV1 {

    TaskServiceImplementation taskService;

    @Autowired
    public TaskRestControllerV1(TaskServiceImplementation taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public ResponseEntity<Task> createTask(@RequestBody CreateObjectWithNameDto createObjectDto) {
        Task task = taskService.createTask(createObjectDto.getParentObjectId(), createObjectDto.getName(), createObjectDto.getPosition());
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PostMapping("/rename")
    public ResponseEntity<Project> renameTask(@RequestBody RenameDto renameDto) {
        taskService.renameTask(renameDto.getObjectId(), renameDto.getName());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/state")
    public ResponseEntity<Project> changeState(@RequestBody ChangeStateDto changeStateDto) {
        taskService.changeTaskState(changeStateDto.getTaskId(), changeStateDto.isState());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/move")
    public ResponseEntity<Project> moveTask(@RequestBody MoveDto moveDto) {
        taskService.moveTask(moveDto.getMovedObjectId(), moveDto.getPreviousParentObject(),
                moveDto.getPreviousPosition(), moveDto.getCurrentParentObject(), moveDto.getCurrentPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<Column> deleteTask(@RequestBody DeleteObjectDto deleteObjectDto) {
        taskService.deleteTask(deleteObjectDto.getObjectId(),
                deleteObjectDto.getParentObjectId(), deleteObjectDto.getPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
