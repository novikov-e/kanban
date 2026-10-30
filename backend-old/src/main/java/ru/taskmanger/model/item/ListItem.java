package ru.taskmanger.model.item;

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
public class ListItem implements Serializable {

    private UUID id;
    private String name;

    @Override
    public String toString() {
        return "ListItem: " + id + " " + name;
    }
}
