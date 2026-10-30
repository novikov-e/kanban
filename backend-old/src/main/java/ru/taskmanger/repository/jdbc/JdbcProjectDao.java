package ru.taskmanger.repository.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.taskmanger.model.Project;
import ru.taskmanger.repository.ProjectDao;
import ru.taskmanger.repository.jdbc.mapper.FullProjectMapper;
import ru.taskmanger.repository.jdbc.mapper.ProjectMapper;
import ru.taskmanger.repository.jdbc.mapper.UUIDMapper;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.UUID;

@Repository("projectDao")
public class JdbcProjectDao implements ProjectDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcProjectDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Project createProject(UUID userId, String projectName, int projectPosition) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            final PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into projects (user_id, project_name, project_position) values (?, ?, ?);",
                    new String[]{"project_id"});
            preparedStatement.setObject(1, userId);
            preparedStatement.setString(2, projectName);
            preparedStatement.setInt(3, projectPosition);
            return preparedStatement;
        }, keyHolder);
        return new Project((UUID) keyHolder.getKeys().get("project_id"), projectName, projectPosition);
    }

    @Override
    public Project findProjectByID(UUID projectId) {
        String sql = "select project_id, project_name, project_position from projects where project_id = ?;";
        return jdbcTemplate.query(sql, new Object[]{projectId}, new ProjectMapper()).stream().findAny().orElse(null);
    }

    @Override
    public Project findProjectByIdWithColumns(UUID projectId) {
        String sql = """
                select * from projects p
                left join columns using (project_id)
                left join task_lists using (column_id)
                left join tasks using (task_list_id)
                where project_id = ?
                order by column_position, task_list_position, task_position;
                """;
        return jdbcTemplate.query(sql, new Object[]{projectId}, new FullProjectMapper())
                .stream().findAny().orElse(null);
    }

    @Override
    public List<UUID> getSortingProjectsByUserId(UUID userId) {
        return jdbcTemplate.query("select project_id from projects where user_id = ? order by project_position;",
                new Object[]{userId}, new UUIDMapper());
    }

    @Override
    public void updateProjectName(UUID projectId, String projectName) {
        jdbcTemplate.update("update projects set project_name = ? where project_id = ?;", projectName, projectId);
    }

    @Override
    public void updateProjectPosition(UUID projectId, int projectPosition) {
        jdbcTemplate.update("update projects set project_position = ? where project_id = ?;",
                projectPosition, projectId);
    }

    @Override
    public void updateProjectUserAndPosition(UUID projectId, UUID userId, int projectPosition) {
        jdbcTemplate.update("update projects set user_id = ?, project_position = ? where project_id = ?;",
                userId, projectPosition, projectId);
    }

//    @Override
//    public List<ListItem> getListProjectsByUserId(UUID userId) {
//        String sql = "select project_id, project_name from projects where user_id = ? order by project_position;";
//        return jdbcTemplate.query(sql, new Object[]{userId}, new ListItemMapper());
//    }

    @Override
    public void moveProject(UUID projectId, UUID previousUserId,
                            int previousPosition, UUID currentUserId, int currentPosition) {
        if (!previousUserId.equals(currentUserId)) {
            List<UUID> previousUserProjects = getSortingProjectsByUserId(previousUserId);
            //Извлечение
            for (int i = previousPosition + 1; i < previousUserProjects.size(); i++) {
                updateProjectPosition(previousUserProjects.get(i), i - 1);
            }
            //Вставка
            List<UUID> currentUserProjects = getSortingProjectsByUserId(currentUserId);
            for (int i = currentPosition; i < currentUserProjects.size(); i++) {
                updateProjectPosition(currentUserProjects.get(i), i + 1);
            }
            updateProjectUserAndPosition(projectId, currentUserId, currentPosition);
        } else {
            List<UUID> projects = getSortingProjectsByUserId(previousUserId);
            if (currentPosition > previousPosition) {
                for (int i = previousPosition + 1; i <= currentPosition; i++) {
                    //сдвиг всех от превиус плюс один до курент вниз на один
                    updateProjectPosition(projects.get(i), i - 1);
                }
            } else {
                for (int i = currentPosition; i < previousPosition; i++) {
                    //Сдвиг всех от куррент до превиус минус один на 1 позицию вверх
                    updateProjectPosition(projects.get(i), i + 1);
                }
            }
            updateProjectPosition(projectId, currentPosition);
        }
    }

    @Override
    @Transactional
    public void deleteProject(UUID projectId, UUID userId, int projectPosition) {
        List<UUID> projects = getSortingProjectsByUserId(userId);
        if (projectPosition != projects.size()) {
            for (int i = projectPosition + 1; i < projects.size(); i++) {
                updateProjectPosition(projects.get(i), i - 1);
            }
        }
        jdbcTemplate.update("delete from projects where project_id = ?;", projectId);
    }
}
