package ru.taskmanger.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.taskmanger.dto.*;
import ru.taskmanger.model.Project;
import ru.taskmanger.model.User;
import ru.taskmanger.service.implementation.UserServiceImplementation;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user")
public class UserRestControllerV1 {

    UserServiceImplementation userService;

    public UserRestControllerV1(UserServiceImplementation userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<User> getUser() {
        User user = userService.getUser();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/theme")
    public ResponseEntity<Project> darkTheme(@RequestBody ThemeDto themeDto) {
        UUID id = UUID.fromString(themeDto.getId());
        boolean darkTheme = themeDto.isDarkTheme();
        userService.darkTheme(id, darkTheme);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping("/last_project")
    public ResponseEntity<Project> lastProject(@RequestBody LastProjectDto lastProjectDto) {
        userService.lastProject(lastProjectDto.getUserId(), lastProjectDto.getProjectId());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }


}
