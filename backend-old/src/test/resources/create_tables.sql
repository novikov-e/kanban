drop table tasks, task_lists, columns, projects, users;

create table if not exists users (
    user_id       uuid    default gen_random_uuid() primary key,
    firstname     varchar(50),
    lastname      varchar(50),
    date_of_birth date,
    sex           varchar(1),
    image         varchar(150),
    email         varchar(100) unique not null,
    password      varchar(255)        not null,
    dark_theme    boolean default false,
    last_project  uuid    default null
);


create table if not exists projects (
    project_id       uuid default gen_random_uuid() primary key,
    user_id          uuid references users (user_id) on delete cascade,
    project_name     varchar(100) not null,
    project_position integer
);

create table if not exists columns (
    column_id       uuid default gen_random_uuid() primary key,
    project_id      uuid references projects (project_id) on delete cascade,
    column_name     varchar(80) not null,
    column_position integer
);

create table if not exists task_lists (
    task_list_id       uuid     default gen_random_uuid() primary key,
    column_id          uuid references columns (column_id) on delete cascade,
    task_list_name     text not null,
    task_list_position integer,
    task_list_color    smallint default 1
);

create table if not exists tasks (
    task_id       uuid    default gen_random_uuid() primary key,
    task_list_id  uuid references task_lists (task_list_id) on delete cascade,
    task_name     text not null,
    task_state    boolean default false,
    task_position integer
);
