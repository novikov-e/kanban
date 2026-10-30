package ru.taskmanger.repository.jdbc.mapper;

import org.springframework.jdbc.core.RowMapper;
import ru.taskmanger.model.Project;
import ru.taskmanger.model.User;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.UUID;

public class UserWithProjectsMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(UUID.fromString(rs.getString("user_id")));
        user.setFirstname(rs.getString("firstname"));
        user.setLastname(rs.getString("lastname"));
        user.setDateOfBirth(rs.getDate("date_of_birth").toLocalDate());
        user.setSex(rs.getString("sex"));
        user.setImage(rs.getString("image"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setDarkTheme(rs.getBoolean("dark_theme"));
        user.setLastProject((UUID) rs.getObject("last_project"));
        ArrayList<Project> projects = new ArrayList<>();
        if (rs.getObject("project_id") != null) {
            do {
                Project project = new Project();
                project.setId((UUID) rs.getObject("project_id"));
                project.setName(rs.getString("project_name"));
                project.setPosition(rs.getInt("project_position"));
                projects.add(project);
            } while (rs.next());
        }
        user.setProjects(projects);
        return user;
    }
}
