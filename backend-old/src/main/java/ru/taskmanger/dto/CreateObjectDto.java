package ru.taskmanger.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
public class CreateObjectDto {
    UUID parentObjectId;
    int position;
}
