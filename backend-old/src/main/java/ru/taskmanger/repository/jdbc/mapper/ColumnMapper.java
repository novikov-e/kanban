package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.Column;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class ColumnMapper implements RowMapper<Column> {

    @Override
    public Column mapRow(ResultSet rs, int rowNum) throws SQLException {
        Column column = new Column();
        column.setId((UUID) rs.getObject("column_id"));
        column.setName(rs.getString("column_name"));
        column.setPosition(rs.getInt("column_position"));
        return column;
    }
}
