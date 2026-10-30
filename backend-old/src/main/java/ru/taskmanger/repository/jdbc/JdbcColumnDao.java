package ru.taskmanger.repository.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.taskmanger.model.Column;
import ru.taskmanger.repository.ColumnDao;
import ru.taskmanger.repository.jdbc.mapper.ColumnMapper;
import ru.taskmanger.repository.jdbc.mapper.UUIDMapper;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.UUID;

@Repository("columnDao")
public class JdbcColumnDao implements ColumnDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcColumnDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Column createColumn(UUID projectId, String columnName, int columnPosition) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            final PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into columns (project_id, column_name, column_position) values (?, ?, ?);",
                    new String[]{"column_id"});
            preparedStatement.setObject(1, projectId);
            preparedStatement.setString(2, columnName);
            preparedStatement.setInt(3, columnPosition);
            return preparedStatement;
        }, keyHolder);
        return new Column((UUID) keyHolder.getKeys().get("column_id"), columnName, columnPosition);
    }

    @Override
    public Column findColumnById(UUID columnId) {
        return jdbcTemplate.query("select column_id, column_name, column_position from columns where column_id = ?;",
                new Object[]{columnId}, new ColumnMapper()).stream().findAny().orElse(null);
    }

    @Override
    public List<UUID> getSortingColumnsByProjectId(UUID projectId) {
        return jdbcTemplate.query("select column_id from columns " +
                        "where project_id = ? order by column_position;",
                new Object[]{projectId}, new UUIDMapper());
    }

    @Override
    public void updateColumnName(UUID columnId, String columnName) {
        jdbcTemplate.update("update columns set column_name = ? " +
                "where column_id = ?;", columnName, columnId);
    }

    @Override
    public void updateColumnPosition(UUID columnId, int columnPosition) {
        jdbcTemplate.update("update columns set column_position = ? " +
                "where column_id = ?;", columnPosition, columnId);
    }

    @Override
    public void updateColumnProjectAndPosition(UUID columnId, UUID projectId, int columnPosition) {
        jdbcTemplate.update("update columns set project_id = ?, column_position = ? where column_id = ?",
                projectId, columnPosition, columnId);
    }

    @Override
    @Transactional
    public void moveColumn(UUID columnId, UUID previousProject,
                           int previousPosition, UUID currentProject, int currentPosition) {
        if (!previousProject.equals(currentProject)) {
            List<UUID> previousProjectColumns = getSortingColumnsByProjectId(previousProject);
            //Извлечение
            for (int i = previousPosition + 1; i < previousProjectColumns.size(); i++) {
                updateColumnPosition(previousProjectColumns.get(i), i - 1);
            }
            //Вставка
            List<UUID> currentProjectColumns = getSortingColumnsByProjectId(currentProject);
            for (int i = currentPosition; i < currentProjectColumns.size(); i++) {
                updateColumnPosition(currentProjectColumns.get(i), i + 1);
            }
            updateColumnProjectAndPosition(columnId, currentProject, currentPosition);
        } else {
            List<UUID> columns = getSortingColumnsByProjectId(previousProject);
            if (currentPosition > previousPosition) {
                for (int i = previousPosition + 1; i <= currentPosition; i++) {
                    //сдвиг всех от превиус плюс один до курент вниз на один
                    updateColumnPosition(columns.get(i), i - 1);
                }
            } else {
                for (int i = currentPosition; i < previousPosition; i++) {
                    //Сдвиг всех от куррент до превиус минус один на 1 позицию вверх
                    updateColumnPosition(columns.get(i), i + 1);
                }
            }
            updateColumnPosition(columnId, currentPosition);
        }
    }

    @Override
    @Transactional
    public void deleteColumn(UUID columnId, UUID projectId, int columnPosition) {
        List<UUID> columns = getSortingColumnsByProjectId(projectId);
        if (columnPosition != columns.size()) {
            for (int i = columnPosition + 1; i < columns.size(); i++) {
                updateColumnPosition(columns.get(i), i - 1);
            }
        }
        jdbcTemplate.update("delete from columns where column_id = ?;", columnId);
    }
}
