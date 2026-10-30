package ru.taskmanger.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
public class MoveDto {
    private UUID movedObjectId;
    private UUID previousParentObject;
    private int previousPosition;
    private UUID currentParentObject;
    private int currentPosition;
}
