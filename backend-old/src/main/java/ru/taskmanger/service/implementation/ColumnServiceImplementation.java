package ru.taskmanger.service.implementation;

import org.springframework.stereotype.Service;
import ru.taskmanger.model.Column;
import ru.taskmanger.repository.jdbc.JdbcColumnDao;
import ru.taskmanger.service.ColumnService;
import java.util.UUID;

@Service
public class ColumnServiceImplementation implements ColumnService {

    JdbcColumnDao jdbcColumnDao;

    public ColumnServiceImplementation(JdbcColumnDao jdbcColumnDao) {
        this.jdbcColumnDao = jdbcColumnDao;
    }

    @Override
    public Column createColumn(UUID projectId, String columnName, int columnPosition) {
        return jdbcColumnDao.createColumn(projectId, columnName, columnPosition);
    }

    @Override
    public void renameColumn(UUID columnId, String columnName) {
        jdbcColumnDao.updateColumnName(columnId, columnName);
    }

    @Override
    public void moveColumn(UUID columnId, UUID previousProjectId, int previousPosition, UUID currentProjectId, int currentPosition) {
        jdbcColumnDao.moveColumn(columnId, previousProjectId, previousPosition, currentProjectId, currentPosition);
    }

    @Override
    public void deleteColumn(UUID columnId, UUID projectId, int columnPosition) {
        jdbcColumnDao.deleteColumn(columnId, projectId, columnPosition);
    }
}
