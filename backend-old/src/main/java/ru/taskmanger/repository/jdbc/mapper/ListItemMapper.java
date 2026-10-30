package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.item.ListItem;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class ListItemMapper implements RowMapper<ListItem> {

    @Override
    public ListItem mapRow(ResultSet rs, int rowNum) throws SQLException {
        ListItem listItem = new ListItem();
        listItem.setId((UUID) rs.getObject(1));
        listItem.setName(rs.getString(2));
        return listItem;
    }
}
