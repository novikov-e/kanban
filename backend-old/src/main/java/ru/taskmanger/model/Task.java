package ru.taskmanger.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Task implements Serializable {

    private UUID id;
    private String name;
    private boolean state = false;
    private int position;

    public Task(String name, boolean state) {
        this.name = name;
        this.state = state;
    }

    public Task(UUID id, String name, int position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    @Override
    public String toString() {
        return "Task: " + position + " " + id + " " + name + " " + state;
    }
}