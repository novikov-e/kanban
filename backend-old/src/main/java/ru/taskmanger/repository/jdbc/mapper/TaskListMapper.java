package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.TaskList;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class TaskListMapper implements RowMapper<TaskList> {

    @Override
    public TaskList mapRow(ResultSet rs, int rowNum) throws SQLException {
        TaskList taskList = new TaskList();
        taskList.setId((UUID) rs.getObject("task_list_id"));
        taskList.setName(rs.getString("task_list_name"));
        taskList.setPosition(rs.getInt("task_list_position"));
        taskList.setColor(rs.getByte("task_list_color"));
        return taskList;
    }
}
