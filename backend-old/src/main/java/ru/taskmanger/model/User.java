package ru.taskmanger.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    private UUID id;
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String sex;
    private String image;
    private String email;
    private String password;
    private boolean darkTheme;
    private UUID lastProject;
    private List<Project> projects = new ArrayList<>();

    @Override
    public String toString() {
        return "User " + id + " " + firstname + " " + lastname +
                " " + dateOfBirth + " " + sex + " " + image  +
                " " + email + " " + password;
    }
}
