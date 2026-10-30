package ru.taskmanger.repository.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.taskmanger.model.Task;
import ru.taskmanger.repository.TaskDao;
import ru.taskmanger.repository.jdbc.mapper.TaskMapper;
import ru.taskmanger.repository.jdbc.mapper.UUIDMapper;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Repository("taskDao")
public class JdbcTaskDao implements TaskDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcTaskDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Task createTask(UUID taskListId, String taskName, int taskPosition) {
        String sql = "insert into tasks (task_list_id, task_name, task_position) values (?, ?, ?);";
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            final PreparedStatement preparedStatement = connection.prepareStatement(sql, new String[]{"task_id"});
            preparedStatement.setObject(1, taskListId);
            preparedStatement.setString(2, taskName);
            preparedStatement.setInt(3, taskPosition);
            return preparedStatement;
        }, keyHolder);
        return new Task((UUID) Objects.requireNonNull(keyHolder.getKeys()).get("task_id"), taskName, taskPosition);
    }

    @Override
    public Task findTaskById(UUID taskId) {
        return jdbcTemplate.query("select * from tasks where task_id = ?;", new Object[]{taskId}, new TaskMapper())
                .stream().findAny().orElse(null);
    }

    @Override
    public List<UUID> getSortingTasksByTaskListId(UUID taskListId) {
        return jdbcTemplate.query("select task_id from tasks where task_list_id = ? order by task_position;",
                new Object[]{taskListId}, new UUIDMapper());
    }

    @Override
    public void updateTaskName(UUID taskId, String taskName) {
        jdbcTemplate.update("update tasks set task_name = ? where task_id = ?;", taskName, taskId);
    }

    @Override
    public void updateTaskPosition(UUID taskId, int taskPosition) {
        jdbcTemplate.update("update tasks set task_position = ? where task_id = ?;", taskPosition, taskId);
    }

    @Override
    public void updateTaskState(UUID taskId, boolean taskState) {
        jdbcTemplate.update("update tasks set task_state = ? where task_id = ?;", taskState, taskId);
    }

    @Override
    public void updateTaskTaskListAndPosition(UUID taskId, UUID taskListId, int taskPosition) {
        jdbcTemplate.update("update tasks set task_list_id = ?, task_position = ? where task_id = ?;",
                taskListId, taskPosition, taskId);
    }

    @Override
    @Transactional
    public void moveTask(UUID taskId, UUID previousTaskListId,
                         int previousPosition, UUID currentTaskListId, int currentPosition) {
        if (!previousTaskListId.equals(currentTaskListId)) {
            List<UUID> previousTaskListTasks = getSortingTasksByTaskListId(previousTaskListId);
            //Извлечение
            for (int i = previousPosition + 1; i < previousTaskListTasks.size(); i++) {
                updateTaskPosition(previousTaskListTasks.get(i), i - 1);
            }
            //Вставка
            List<UUID> currentTaskListTasks = getSortingTasksByTaskListId(currentTaskListId);
            for (int i = currentPosition; i < currentTaskListTasks.size(); i++) {
                updateTaskPosition(currentTaskListTasks.get(i), i + 1);
            }
            updateTaskTaskListAndPosition(taskId, currentTaskListId, currentPosition);
        } else {
            List<UUID> tasks = getSortingTasksByTaskListId(previousTaskListId);
            if (currentPosition > previousPosition) {
                for (int i = previousPosition + 1; i <= currentPosition; i++) {
                    //сдвиг всех от превиус плюс один до курент вниз на один
                    updateTaskPosition(tasks.get(i), i - 1);
                }
            } else {
                for (int i = currentPosition; i < previousPosition; i++) {
                    //Сдвиг всех от куррент до превиус минус один на 1 позицию вверх
                    updateTaskPosition(tasks.get(i), i + 1);
                }
            }
            updateTaskPosition(taskId, currentPosition);
        }
    }

    @Override
    public void deleteTask(UUID taskId, UUID taskListId, int taskPosition) {
        List<UUID> tasks = getSortingTasksByTaskListId(taskListId);
        if (taskPosition != tasks.size() - 1) {
            for (int i = taskPosition + 1; i < tasks.size(); i++) {
                updateTaskPosition(tasks.get(i), i - 1);
            }
        }
        jdbcTemplate.update("delete from tasks where task_id = ?;", taskId);
    }
}
