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
public class Column implements Serializable {

    private UUID id;
    private String name;
    private int position;
    private List<TaskList> taskLists = new ArrayList<>();

    public Column(String name) {
        this.name = name;
    }

    public Column(UUID id, String name, int position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    @Override
    public String toString() {
        String result =  "Column: " + position + " " + id + " " + name + "\n";
        for (TaskList taskList : taskLists) {
            result += taskList.toString() + "\n";
        }
        return result;
    }
}