package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.Project;
import java.util.UUID;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectMapper implements RowMapper<Project> {

    @Override
    public Project mapRow(ResultSet rs, int rowNum) throws SQLException {
        Project project = new Project();
        project.setId((UUID) rs.getObject("project_id"));
        project.setName(rs.getString("project_name"));
        project.setPosition(rs.getInt("project_position"));
        return project;
    }
}
