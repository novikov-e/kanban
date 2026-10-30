package ru.taskmanger.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
public class ThemeDto implements Serializable {
    private String id;
    private boolean darkTheme;
}
