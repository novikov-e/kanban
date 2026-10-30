package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.Column;
import ru.taskmanger.model.Project;
import ru.taskmanger.model.Task;
import ru.taskmanger.model.TaskList;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.UUID;

public class FullProjectMapper implements RowMapper<Project> {

    @Override
    public Project mapRow(ResultSet rs, int rowNum) throws SQLException {
        Project project = null;
        ArrayList<Column> columns = new ArrayList<>();
        Column column = null;
        ArrayList<TaskList> taskLists = new ArrayList<>();
        TaskList taskList = null;
        ArrayList<Task> tasks = new ArrayList<>();
        do {
            if (project == null) {
                project = new Project();
                project.setId((UUID) rs.getObject("project_id"));
                project.setName(rs.getString("project_name"));
                project.setPosition(rs.getInt("project_position"));
                project.setColumns(columns);
            }
            UUID columnId = (UUID) rs.getObject("column_id");
            if (columnId != null) {
                if (column == null) {
                    column = new Column();
                    column.setId(columnId);
                    column.setName(rs.getString("column_name"));
                    column.setPosition(rs.getInt("column_position"));
                    column.setTaskLists(taskLists);
                    columns.add(column);
                }
                if (!column.getId().equals(columnId)) {
                    column = new Column();
                    column.setId(columnId);
                    column.setName(rs.getString("column_name"));
                    column.setPosition(rs.getInt("column_position"));
                    taskLists = new ArrayList<>();
                    column.setTaskLists(taskLists);
                    columns.add(column);
                }
                UUID taskListId = (UUID) rs.getObject("task_list_id");
                if (taskListId != null) {
                    if (taskList == null) {
                        taskList = new TaskList();
                        taskList.setId(taskListId);
                        taskList.setName(rs.getString("task_list_name"));
                        taskList.setColor(rs.getByte("task_list_color"));
                        taskList.setPosition(rs.getInt("task_list_position"));
                        taskList.setTasks(tasks);
                        taskLists.add(taskList);
                    }
                    if (!taskList.getId().equals(taskListId)) {
                        taskList = new TaskList();
                        taskList.setId(taskListId);
                        taskList.setName(rs.getString("task_list_name"));
                        taskList.setColor(rs.getByte("task_list_color"));
                        taskList.setPosition(rs.getInt("task_list_position"));
                        tasks = new ArrayList<>();
                        taskList.setTasks(tasks);
                        taskLists.add(taskList);
                    }
                    UUID taskId = (UUID) rs.getObject("task_id");
                    if (taskId != null) {
                        Task task = new Task();
                        task.setId(taskId);
                        task.setName(rs.getString("task_name"));
                        task.setState(rs.getBoolean("task_state"));
                        task.setPosition(rs.getInt("task_position"));
                        tasks.add(task);
                    }
                }
            }
        } while (rs.next());
        return project;
    }
}
