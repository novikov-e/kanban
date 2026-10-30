package ru.taskmanger.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Project implements Serializable {

    private UUID id;
    private String name;
    private int position;
    private List<Column> columns = new ArrayList<>();

    public Project(String name) {
        this.name = name;
    }

    public Project(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public Project(UUID id, String name, int position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    @Override
    public String toString() {
        String result =  "Project: " + position + " " + id + " " + name + "\n";
        for (Column column : columns) {
            result += column.toString() + "\n";
        }
        return result;
    }
}