package ru.taskmanger.repository.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.taskmanger.model.TaskList;
import ru.taskmanger.repository.TaskListDao;
import ru.taskmanger.repository.jdbc.mapper.TaskListMapper;
import ru.taskmanger.repository.jdbc.mapper.UUIDMapper;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.UUID;

@Repository("taskListDao")
public class JdbcTaskListDao implements TaskListDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcTaskListDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public TaskList createTaskList(UUID columnId, String taskListName, int taskListPosition) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            final PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into task_lists (column_id, task_list_name, task_list_position) values (?, ?, ?);",
                    new String[]{"task_list_id"});
            preparedStatement.setObject(1, columnId);
            preparedStatement.setString(2, taskListName);
            preparedStatement.setInt(3, taskListPosition);
            return preparedStatement;
        }, keyHolder);
        return new TaskList((UUID) keyHolder.getKeys().get("task_list_id"), taskListName, (short) 1, taskListPosition);
    }

    @Override
    public TaskList findTaskListById(UUID taskListId) {
        String sql = """
                select task_list_id, task_list_name, task_list_position, task_list_color
                from task_lists where task_list_id = ?;
                """;
        return jdbcTemplate.query(sql, new Object[]{taskListId}, new TaskListMapper()).stream().findAny().orElse(null);
    }

    @Override
    public List<UUID> getSortingTaskListsByColumnId(UUID columnId) {
        return jdbcTemplate.query("select task_list_id from task_lists " +
                "where column_id = ? order by task_list_position;", new Object[]{columnId}, new UUIDMapper());
    }

    @Override
    public void updateTaskListName(UUID taskListId, String taskListName) {
        jdbcTemplate.update("update task_lists set task_list_name = ? where task_list_id = ?;",
                taskListName, taskListId);
    }

    @Override
    public void updateTaskListColor(UUID taskListId, short taskListColor) {
        jdbcTemplate.update("update task_lists set task_list_color = ? where task_list_id = ?;",
                taskListColor, taskListId);
    }

    @Override
    public void updateTaskListPosition(UUID taskListId, int taskListPosition) {
        jdbcTemplate.update("update task_lists set task_list_position = ? where task_list_id = ?;",
                taskListPosition, taskListId);
    }

    @Override
    public void updateTaskListColumnAndPosition(UUID taskListId, UUID columnId, int taskListPosition) {
        jdbcTemplate.update("update task_lists set column_id = ?, task_list_position = ? where task_list_id = ?",
                columnId, taskListPosition, taskListId);
    }

    @Override
    @Transactional
    public void moveTaskList(UUID taskListId, UUID previousColumn,
                             int previousPosition, UUID currentColumn, int currentPosition) {
        if (!previousColumn.equals(currentColumn)) {
            List<UUID> previousColumnTaskLists = getSortingTaskListsByColumnId(previousColumn);
            //Извлечение
            for (int i = previousPosition + 1; i < previousColumnTaskLists.size(); i++) {
                updateTaskListPosition(previousColumnTaskLists.get(i), i - 1);
            }
            //Вставка
            List<UUID> currentColumnTaskLists = getSortingTaskListsByColumnId(currentColumn);
            for (int i = currentPosition; i < currentColumnTaskLists.size(); i++) {
                updateTaskListPosition(currentColumnTaskLists.get(i), i + 1);
            }
            updateTaskListColumnAndPosition(taskListId, currentColumn, currentPosition);
        } else {
            List<UUID> taskLists = getSortingTaskListsByColumnId(previousColumn);
            if (currentPosition > previousPosition) {
                for (int i = previousPosition + 1; i <= currentPosition; i++) {
                    //сдвиг всех от превиус плюс один до курент вниз на один
                    updateTaskListPosition(taskLists.get(i), i - 1);
                }
            } else {
                for (int i = currentPosition; i < previousPosition; i++) {
                    //Сдвиг всех от куррент до превиус минус один на 1 позицию вверх
                    updateTaskListPosition(taskLists.get(i), i + 1);
                }
            }
            updateTaskListPosition(taskListId, currentPosition);
        }
    }

    @Override
    @Transactional
    public void deleteTaskList(UUID taskListId, UUID columnId, int taskListPosition) {
        List<UUID> taskLists = getSortingTaskListsByColumnId(columnId);
        if (taskListPosition != taskLists.size() - 1) {
            for (int i = taskListPosition + 1; i < taskLists.size(); i++) {
                updateTaskListPosition(taskLists.get(i), i - 1);
            }
        }
        System.out.println(taskListId);
        jdbcTemplate.update("delete from task_lists where task_list_id = ?;", taskListId);
    }
}
