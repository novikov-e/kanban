package ru.taskmanger.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.taskmanger.dto.CreateObjectWithNameDto;
import ru.taskmanger.dto.DeleteObjectDto;
import ru.taskmanger.dto.MoveDto;
import ru.taskmanger.dto.RenameDto;
import ru.taskmanger.model.Column;
import ru.taskmanger.model.Project;
import ru.taskmanger.service.implementation.ColumnServiceImplementation;

@RestController
@RequestMapping("/api/v1/column")
public class ColumnRestControllerV1 {

    ColumnServiceImplementation columnService;

    @Autowired
    public ColumnRestControllerV1(ColumnServiceImplementation columnService) {
        this.columnService = columnService;
    }

    @PostMapping("/create")
    public ResponseEntity<Column> createColumn(@RequestBody CreateObjectWithNameDto createObjectDto) {
        Column column = this.columnService.createColumn(
                createObjectDto.getParentObjectId(), createObjectDto.getName(), createObjectDto.getPosition());
        return new ResponseEntity<>(column, HttpStatus.OK);
    }

    @PostMapping("/rename")
    public ResponseEntity<Project> renameColumn(@RequestBody RenameDto renameDto) {
        columnService.renameColumn(renameDto.getObjectId(), renameDto.getName());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/move")
    public ResponseEntity<Project> moveColumn(@RequestBody MoveDto moveDto) {
        columnService.moveColumn(moveDto.getMovedObjectId(), moveDto.getPreviousParentObject(),
                moveDto.getPreviousPosition(), moveDto.getCurrentParentObject(), moveDto.getCurrentPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<Column> deleteColumn(@RequestBody DeleteObjectDto deleteObjectDto) {
        columnService.deleteColumn(deleteObjectDto.getObjectId(),
                deleteObjectDto.getParentObjectId(), deleteObjectDto.getPosition());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
