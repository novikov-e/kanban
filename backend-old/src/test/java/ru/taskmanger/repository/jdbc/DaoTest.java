package ru.taskmanger.repository.jdbc;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import ru.taskmanger.ContainersEnvironment;
import ru.taskmanger.TaskMangerApplication;
import ru.taskmanger.model.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = TaskMangerApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DaoTest extends ContainersEnvironment {

    @Autowired
    JdbcUserDao jdbcUserDao;
    @Autowired
    JdbcProjectDao jdbcProjectDao;
    @Autowired
    JdbcColumnDao jdbcColumnDao;
    @Autowired
    JdbcTaskListDao jdbcTaskListDao;
    @Autowired
    JdbcTaskDao jdbcTaskDao;

    @Test
    public void testUserDao() {
        String email = "testUser@email.com";
        String updateEmail = "updateTestUser@email.com";
        String password = "password";
        String updatePassword = "update_password";
        String image = "/home/imege.jpg";
        String firstname = "Name";
        String lastname = "Lastname";
        LocalDate date = LocalDate.of(1990, 1, 31);
        String sex = "M";
        UUID uuid = jdbcUserDao.createUser(email, password);
        jdbcUserDao.updateImage(uuid, image);
        jdbcUserDao.updateUserData(uuid, firstname, lastname, date, sex);
        User user = jdbcUserDao.findUserById(uuid);
        assertThat(user.getEmail()).isEqualTo(email);
        assertThat(user.getPassword()).isEqualTo(password);
        assertThat(user.getImage()).isEqualTo(image);
        assertThat(user.getFirstname()).isEqualTo(firstname);
        assertThat(user.getLastname()).isEqualTo(lastname);
        assertThat(user.getDateOfBirth()).isEqualTo(date);
        assertThat(user.getSex()).isEqualTo(sex);
        jdbcUserDao.updateEmail(uuid, updateEmail);
        jdbcUserDao.updatePassword(uuid, updatePassword);
        User updatedUser = jdbcUserDao.findUserById(uuid);
        assertThat(updatedUser.getEmail()).isEqualTo(updateEmail);
        assertThat(updatedUser.getPassword()).isEqualTo(updatePassword);
        jdbcUserDao.deleteUser(uuid);
        assertThat(jdbcUserDao.findUserById(uuid)).isEqualTo(null);
    }

    @Test
    public void testProjectDao() {
        String projectName = "Test Project";
        String updatedProjectName = "Updated Project";
        int projectPosition = 0;
        int updatedProjectPosition = 5;
        UUID userId = jdbcUserDao.createUser("testProject@email.com", "password");
        Project newProject = jdbcProjectDao.createProject(userId, projectName, projectPosition);
        Project project = jdbcProjectDao.findProjectByID(newProject.getId());
        assertThat(project.getName()).isEqualTo(projectName);
        assertThat(project.getPosition()).isEqualTo(projectPosition);
        jdbcProjectDao.updateProjectName(project.getId(), updatedProjectName);
        jdbcProjectDao.updateProjectPosition(project.getId(), updatedProjectPosition);
        Project updatedProject = jdbcProjectDao.findProjectByID(project.getId());
        assertThat(updatedProject.getName()).isEqualTo(updatedProjectName);
        assertThat(updatedProject.getPosition()).isEqualTo(updatedProjectPosition);
        jdbcProjectDao.deleteProject(project.getId(), userId, updatedProjectPosition);
        assertThat(jdbcProjectDao.findProjectByID(project.getId())).isEqualTo(null);
        jdbcUserDao.deleteUser(userId);
    }

    @Test
    public void testColumnDao() {
        UUID userId = jdbcUserDao.createUser("testColumn@email.com", "password");
        Project project = jdbcProjectDao.createProject(userId, "projectName", 0);
        String columnName = "Новая колонка";
        String updatedName = "Updated Column";
        int columnPosition = 0;
        int updatedPosition = 5;
        Column newColumn = jdbcColumnDao.createColumn(project.getId(), columnName, columnPosition);
        Column column = jdbcColumnDao.findColumnById(newColumn.getId());
        assertThat(column.getName()).isEqualTo(columnName);
        assertThat(column.getPosition()).isEqualTo(columnPosition);
        jdbcColumnDao.updateColumnName(newColumn.getId(), updatedName);
        jdbcColumnDao.updateColumnPosition(newColumn.getId(), updatedPosition);
        Column updatedColumn = jdbcColumnDao.findColumnById(newColumn.getId());
        assertThat(updatedColumn.getName()).isEqualTo(updatedName);
        assertThat(updatedColumn.getPosition()).isEqualTo(updatedPosition);
        jdbcColumnDao.deleteColumn(newColumn.getId(), project.getId(), updatedPosition);
        assertThat(jdbcColumnDao.findColumnById(newColumn.getId())).isEqualTo(null);
        jdbcUserDao.deleteUser(userId);
    }

    @Test
    public void testTaskListDao() {
        UUID userId = jdbcUserDao.createUser("testTaskList@email.com", "password");
        Project project = jdbcProjectDao.createProject(userId, "projectName", 0);
        Column column = jdbcColumnDao.createColumn(project.getId(), "1", 0);
        String name = "Новый список";
        String updatedName = "Updated Task List";
        int position = 0;
        int updatedPosition = 5;
        byte color = 1;
        byte updatedColor = 5;
        TaskList taskListId = jdbcTaskListDao.createTaskList(column.getId(), name, position);
        TaskList taskList = jdbcTaskListDao.findTaskListById(taskListId.getId());
        assertThat(taskList.getName()).isEqualTo(name);
        assertThat(taskList.getPosition()).isEqualTo(position);
        assertThat(taskList.getColor()).isEqualTo(color);
        jdbcTaskListDao.updateTaskListName(taskListId.getId(), updatedName);
        jdbcTaskListDao.updateTaskListPosition(taskListId.getId(), updatedPosition);
        jdbcTaskListDao.updateTaskListColor(taskListId.getId(), updatedColor);
        TaskList updatedTaskList = jdbcTaskListDao.findTaskListById(taskListId.getId());
        assertThat(updatedTaskList.getName()).isEqualTo(updatedName);
        assertThat(updatedTaskList.getPosition()).isEqualTo(updatedPosition);
        assertThat(updatedTaskList.getColor()).isEqualTo(updatedColor);
        jdbcTaskListDao.deleteTaskList(taskListId.getId(), column.getId(), updatedPosition);
        assertThat(jdbcTaskListDao.findTaskListById(taskListId.getId())).isEqualTo(null);
        jdbcUserDao.deleteUser(userId);
    }

    @Test
    public void testTaskDao() {
        UUID userId = jdbcUserDao.createUser("testTask@email.com", "password");
        Project project = jdbcProjectDao.createProject(userId, "Project", 0);
        Column column = jdbcColumnDao.createColumn(project.getId(), "1", 0);
        TaskList taskList = jdbcTaskListDao.createTaskList(column.getId(), "1", 0);
        String name = "Новая задача";
        String updatedName = "Updated Task";
        int position = 0;
        int updatedPosition = 5;
        boolean state = false;
        boolean updatedState = true;
        Task taskId = jdbcTaskDao.createTask(taskList.getId(), name, position);
        Task task = jdbcTaskDao.findTaskById(taskId.getId());
        assertThat(task.getName()).isEqualTo(name);
        assertThat(task.getPosition()).isEqualTo(position);
        assertThat(task.isState()).isEqualTo(state);
        jdbcTaskDao.updateTaskName(taskId.getId(), updatedName);
        jdbcTaskDao.updateTaskPosition(taskId.getId(), updatedPosition);
        jdbcTaskDao.updateTaskState(taskId.getId(), updatedState);
        Task updatedTask = jdbcTaskDao.findTaskById(taskId.getId());
        assertThat(updatedTask.getName()).isEqualTo(updatedName);
        assertThat(updatedTask.getPosition()).isEqualTo(updatedPosition);
        assertThat(updatedTask.isState()).isEqualTo(updatedState);
        jdbcTaskDao.deleteTask(taskId.getId(), taskList.getId(), updatedPosition);
        assertThat(jdbcTaskDao.findTaskById(taskId.getId())).isEqualTo(null);
        jdbcUserDao.deleteUser(userId);
    }

    @Test
    public void testFullProjectAndSortings() {
        UUID userId = jdbcUserDao.createUser("TestFullProject@email.com", "password");
        Project firstProjectId = jdbcProjectDao.createProject(userId, "Project 1", 0);
        Project secondProjectId = jdbcProjectDao.createProject(userId, "Project 2", 1);
        Project thirdProjectId = jdbcProjectDao.createProject(userId, "Project 3", 2);

        Column firstColumnId = jdbcColumnDao.createColumn(firstProjectId.getId(), "1", 0);
        TaskList firstTaskListId = jdbcTaskListDao.createTaskList(firstColumnId.getId(), "1", 0);
        Task firstTaskId = jdbcTaskDao.createTask(firstTaskListId.getId(), "1", 0);
        Task secondTaskId = jdbcTaskDao.createTask(firstTaskListId.getId(), "2", 1);
        Task thirdTaskId = jdbcTaskDao.createTask(firstTaskListId.getId(), "3", 2);
        TaskList secondTaskListId = jdbcTaskListDao.createTaskList(firstColumnId.getId(), "2", 1);
        Task fourthTaskId = jdbcTaskDao.createTask(secondTaskListId.getId(), "4", 0);
        Task fifthTaskId = jdbcTaskDao.createTask(secondTaskListId.getId(), "5", 1);
        Task sixthTaskId = jdbcTaskDao.createTask(secondTaskListId.getId(), "6", 2);
        Task seventhTaskId = jdbcTaskDao.createTask(secondTaskListId.getId(), "7", 3);

        Column secondColumnId = jdbcColumnDao.createColumn(firstProjectId.getId(), "2", 1);
        TaskList thirdTaskListId = jdbcTaskListDao.createTaskList(secondColumnId.getId(), "3", 2);
        Task eighthTaskId = jdbcTaskDao.createTask(thirdTaskListId.getId(), "8", 0);
        Task ninthTaskId = jdbcTaskDao.createTask(thirdTaskListId.getId(), "9", 1);
        Task tenthTaskId = jdbcTaskDao.createTask(thirdTaskListId.getId(), "10", 2);
        Task eleventhTaskId = jdbcTaskDao.createTask(thirdTaskListId.getId(), "11", 4);
        Task twelfthTaskId = jdbcTaskDao.createTask(thirdTaskListId.getId(), "12", 5);

        Column thirdColumnId = jdbcColumnDao.createColumn(firstProjectId.getId(), "3", 2);
        TaskList fourthTaskListId = jdbcTaskListDao.createTaskList(thirdColumnId.getId(), "4", 3);
        Task thirteenthTaskId = jdbcTaskDao.createTask(fourthTaskListId.getId(), "13", 0);
        Task fourteenthTaskId = jdbcTaskDao.createTask(fourthTaskListId.getId(), "14", 1);
        TaskList fifthTaskListId = jdbcTaskListDao.createTaskList(thirdColumnId.getId(), "5", 4);
        Task fifteenthTaskId = jdbcTaskDao.createTask(fifthTaskListId.getId(), "15", 0);
        Task sixteenthTaskId = jdbcTaskDao.createTask(fifthTaskListId.getId(), "16", 1);
        Task seventeenthTaskId = jdbcTaskDao.createTask(fifthTaskListId.getId(), "17", 2);
        Task eighteenthTaskId = jdbcTaskDao.createTask(fifthTaskListId.getId(), "18", 3);
        TaskList sixthTaskListId = jdbcTaskListDao.createTaskList(thirdColumnId.getId(), "6", 5);
        Task nineteenthTaskId = jdbcTaskDao.createTask(sixthTaskListId.getId(), "19", 0);
        Task twentiethTaskId = jdbcTaskDao.createTask(sixthTaskListId.getId(), "20", 1);
        Task twentyFirstTaskId = jdbcTaskDao.createTask(sixthTaskListId.getId(), "21", 2);
        Task twentySecondTaskId = jdbcTaskDao.createTask(sixthTaskListId.getId(), "22", 3);

        Project project = jdbcProjectDao.findProjectByIdWithColumns(firstProjectId.getId());
        assertThat(project.getColumns().get(0).getId()).isEqualTo(firstColumnId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(0).getId()).isEqualTo(firstTaskListId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(0).getTasks().get(0).getId()).isEqualTo(firstTaskId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(0).getTasks().get(1).getId()).isEqualTo(secondTaskId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(0).getTasks().get(2).getId()).isEqualTo(thirdTaskId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(1).getId()).isEqualTo(secondTaskListId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(1).getTasks().get(0).getId()).isEqualTo(fourthTaskId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(1).getTasks().get(1).getId()).isEqualTo(fifthTaskId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(1).getTasks().get(2).getId()).isEqualTo(sixthTaskId.getId());
        assertThat(project.getColumns().get(0).getTaskLists().get(1).getTasks().get(3).getId()).isEqualTo(seventhTaskId.getId());

        assertThat(project.getColumns().get(1).getId()).isEqualTo(secondColumnId.getId());
        assertThat(project.getColumns().get(1).getTaskLists().get(0).getId()).isEqualTo(thirdTaskListId.getId());
        assertThat(project.getColumns().get(1).getTaskLists().get(0).getTasks().get(0).getId()).isEqualTo(eighthTaskId.getId());
        assertThat(project.getColumns().get(1).getTaskLists().get(0).getTasks().get(1).getId()).isEqualTo(ninthTaskId.getId());
        assertThat(project.getColumns().get(1).getTaskLists().get(0).getTasks().get(2).getId()).isEqualTo(tenthTaskId.getId());
        assertThat(project.getColumns().get(1).getTaskLists().get(0).getTasks().get(3).getId()).isEqualTo(eleventhTaskId.getId());
        assertThat(project.getColumns().get(1).getTaskLists().get(0).getTasks().get(4).getId()).isEqualTo(twelfthTaskId.getId());

        assertThat(project.getColumns().get(2).getId()).isEqualTo(thirdColumnId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(0).getId()).isEqualTo(fourthTaskListId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(0).getTasks().get(0).getId()).isEqualTo(thirteenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(0).getTasks().get(1).getId()).isEqualTo(fourteenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(1).getId()).isEqualTo(fifthTaskListId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(1).getTasks().get(0).getId()).isEqualTo(fifteenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(1).getTasks().get(1).getId()).isEqualTo(sixteenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(1).getTasks().get(2).getId()).isEqualTo(seventeenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(1).getTasks().get(3).getId()).isEqualTo(eighteenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(2).getId()).isEqualTo(sixthTaskListId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(2).getTasks().get(0).getId()).isEqualTo(nineteenthTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(2).getTasks().get(1).getId()).isEqualTo(twentiethTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(2).getTasks().get(2).getId()).isEqualTo(twentyFirstTaskId.getId());
        assertThat(project.getColumns().get(2).getTaskLists().get(2).getTasks().get(3).getId()).isEqualTo(twentySecondTaskId.getId());

        List<UUID> sortingProjects = jdbcProjectDao.getSortingProjectsByUserId(userId);
        assertThat(sortingProjects.get(0)).isEqualTo(firstProjectId.getId());
        assertThat(sortingProjects.get(1)).isEqualTo(secondProjectId.getId());
        assertThat(sortingProjects.get(2)).isEqualTo(thirdProjectId.getId());

        List<UUID> sortingColumns = jdbcColumnDao.getSortingColumnsByProjectId(firstProjectId.getId());
        assertThat(sortingColumns.get(0)).isEqualTo(firstColumnId.getId());
        assertThat(sortingColumns.get(1)).isEqualTo(secondColumnId.getId());
        assertThat(sortingColumns.get(2)).isEqualTo(thirdColumnId.getId());

        List<UUID> sortingTaskLists = jdbcTaskListDao.getSortingTaskListsByColumnId(firstColumnId.getId());
        assertThat(sortingTaskLists.get(0)).isEqualTo(firstTaskListId.getId());
        assertThat(sortingTaskLists.get(1)).isEqualTo(secondTaskListId.getId());

        List<UUID> sortingTasks = jdbcTaskDao.getSortingTasksByTaskListId(firstTaskListId.getId());
        assertThat(sortingTasks.get(0)).isEqualTo(firstTaskId.getId());
        assertThat(sortingTasks.get(1)).isEqualTo(secondTaskId.getId());
        assertThat(sortingTasks.get(2)).isEqualTo(thirdTaskId.getId());

        jdbcUserDao.deleteUser(userId);
        assertThat(jdbcTaskDao.findTaskById(firstTaskId.getId())).isEqualTo(null);
        assertThat(jdbcTaskListDao.findTaskListById(firstTaskListId.getId())).isEqualTo(null);
        assertThat(jdbcColumnDao.findColumnById(firstColumnId.getId())).isEqualTo(null);
        assertThat(jdbcProjectDao.findProjectByID(firstProjectId.getId())).isEqualTo(null);
        assertThat(jdbcUserDao.findUserById(userId)).isEqualTo(null);
    }
}
