package ru.taskmanger.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.taskmanger.dto.*;
import ru.taskmanger.model.Column;
import ru.taskmanger.model.Project;
import ru.taskmanger.model.TaskList;
import ru.taskmanger.service.implementation.ColumnServiceImplementation;
import ru.taskmanger.service.implementation.TaskListServiceImplementation;

@RestController
@RequestMapping("/api/v1/task_list")
public class TaskListRestControllerV1 {

    TaskListServiceImplementation taskListService;
    ColumnServiceImplementation columnService;

    @Autowired
    public TaskListRestControllerV1(TaskListServiceImplementation taskListService,
                                    ColumnServiceImplementation columnService) {
        this.taskListService = taskListService;
        this.columnService = columnService;
    }

    @PostMapping("/create")
    public ResponseEntity<TaskList> createTaskList(@RequestBody CreateObjectWithNameDto createObjectDto) {
        TaskList taskList = this.taskListService.createTaskList(
                createObjectDto.getParentObjectId(), createObjectDto.getName(), createObjectDto.getPosition());
        return new ResponseEntity<>(taskList, HttpStatus.OK);
    }

    @PostMapping("/rename")
    public ResponseEntity<Project> renameTaskList(@RequestBody RenameDto renameDto) {
        taskListService.renameTaskList(renameDto.getObjectId(), renameDto.getName());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/color")
    public ResponseEntity<Project> changeTaskListColor(@RequestBody ChangeColorDto changeColorDto) {
        taskListService.changeTaskListColor(changeColorDto.getTaskListId(), changeColorDto.getColor());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/move")
    public ResponseEntity<Project> moveTaskList(@RequestBody MoveDto moveDto) {
        taskListService.moveTaskList(moveDto.getMovedObjectId(), moveDto.getPreviousParentObject(),
                moveDto.getPreviousPosition(), moveDto.getCurrentParentObject(), moveDto.getCurrentPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<Column> deleteTaskList(@RequestBody DeleteObjectDto deleteObjectDto) {
        taskListService.deleteTaskList(deleteObjectDto.getObjectId(),
                deleteObjectDto.getParentObjectId(), deleteObjectDto.getPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
