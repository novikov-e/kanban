package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class UUIDMapper implements RowMapper<UUID> {

    @Override
    public UUID mapRow(ResultSet rs, int rowNum) throws SQLException {
        return (UUID) rs.getObject(1);
    }
}
