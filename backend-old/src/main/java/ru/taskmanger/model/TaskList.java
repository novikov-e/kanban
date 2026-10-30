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
public class TaskList implements Serializable {

    private UUID id;
    private String name;
    private int position;
    private short color;
    private List<Task> tasks = new ArrayList<>();

    public TaskList(String name) {
        this.name = name;
    }

    public TaskList(UUID id, String name, short color, int position) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.position = position;
    }

    @Override
    public String toString() {
        String result = "TaskList: " + position + " " + id + " " + name + "\n";
        for (Task task : tasks) {
            result += task.toString() + "\n";
        }
        return result;
    }
}