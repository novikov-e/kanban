package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.Task;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class TaskMapper implements RowMapper<Task> {

    @Override
    public Task mapRow(ResultSet rs, int rowNum) throws SQLException {
        Task task = new Task();
        task.setId((UUID) rs.getObject("task_id"));
        task.setName(rs.getString("task_name"));
        task.setState(rs.getBoolean("task_state"));
        task.setPosition(rs.getInt("task_position"));
        return task;
    }
}
