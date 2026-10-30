package ru.taskmanger.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
public class LastProjectDto {
    private UUID userId;
    private UUID projectId;
}
