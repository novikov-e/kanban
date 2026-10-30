"""init_database

Revision ID: e0c305f4253d
Revises: 
Create Date: 2026-10-29 17:41:59.805077

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'e0c305f4253d'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        create or replace function update_updated_at_column()
        returns trigger as $$
        begin
            new.updated_at = now();
            return new;
        end;
        $$ language 'plpgsql';
    """)

    op.execute("""
        create or replace function soft_delete_board_cascade()
        returns trigger as $$
        begin
            if new.deleted_at is distinct from old.deleted_at then
                update columns set deleted_at = new.deleted_at where board_id = new.board_id;
            end if;
            return new;
        end;
        $$ language plpgsql;
    """)

    op.execute("""
        create or replace function soft_delete_column_cascade()
        returns trigger as $$
        begin
            if new.deleted_at is distinct from old.deleted_at then
                update tasks set deleted_at = new.deleted_at where column_id = new.column_id;
            end if;
            return new;
        end;
        $$ language plpgsql;
    """)

    op.execute("""
        create or replace function soft_delete_task_cascade()
        returns trigger as $$
        begin
            if new.deleted_at is distinct from old.deleted_at then
                update subtasks set deleted_at = new.deleted_at where task_id = new.task_id;
            end if;
            return new;
        end;
        $$ language plpgsql;
    """)

    op.execute("""
        create table if not exists users (
            id uuid default gen_random_uuid() primary key,
            firstname varchar(50),
            lastname varchar(50),
            date_of_birth date,
            sex varchar(1),
            image varchar(150),
            email varchar(100) unique not null,
            password varchar(255) not null,
            dark_theme boolean default false,
            last_project uuid default null,
            created_at timestamp with time zone default now() not null,
            updated_at timestamp with time zone default now() not null,
            deleted_at timestamp with time zone default null
        );
    """)

    op.execute("""
        create trigger update_users_modtime before update on users for each row execute procedure update_updated_at_column();
    """)

    op.execute("""
        create table if not exists boards (
            board_id uuid default gen_random_uuid() primary key,
            user_id uuid references users (id),
            board_name varchar(100) not null,
            board_position integer not null default 0,
            created_at timestamp with time zone default now() not null,
            updated_at timestamp with time zone default now() not null,
            deleted_at timestamp with time zone default null
        );
    """)

    op.execute("""
        create index user_boards_index on boards (user_id);
    """)

    op.execute("""
        create trigger update_boards_modtime before update on boards for each row execute procedure update_updated_at_column();
    """)

    op.execute("""
        create trigger trigger_soft_delete_board after update of deleted_at on boards for each row execute procedure soft_delete_board_cascade();
    """)

    op.execute("""
        create table if not exists columns (
            column_id uuid default gen_random_uuid() primary key,
            board_id uuid references boards (board_id),
            column_name varchar(80) not null,
            column_position integer not null default 0,
            created_at timestamp with time zone default now() not null,
            updated_at timestamp with time zone default now() not null,
            deleted_at timestamp with time zone default null
        );
    """)

    op.execute("""
        create index board_columns_index on columns (board_id);
    """)

    op.execute("""
        create trigger update_columns_modtime before update on columns for each row execute procedure update_updated_at_column();
    """)

    op.execute("""
        create trigger trigger_soft_delete_column after update of deleted_at on columns for each row execute procedure soft_delete_column_cascade();
    """)

    op.execute("""
        create table if not exists tasks (
            task_id uuid default gen_random_uuid() primary key,
            column_id uuid references columns (column_id),
            task_name text not null,
            color integer not null default 1,
            task_position integer not null default 0,
            created_at timestamp with time zone default now() not null,
            updated_at timestamp with time zone default now() not null,
            deleted_at timestamp with time zone default null
        );
    """)

    op.execute("""
        create index column_tasks_index on tasks (column_id);
    """)

    op.execute("""
        create trigger update_tasks_modtime before update on tasks for each row execute procedure update_updated_at_column();
    """)

    op.execute("""
        create trigger trigger_soft_delete_task after update of deleted_at on tasks for each row execute procedure soft_delete_task_cascade();
    """)

    op.execute("""
        create table if not exists subtasks (
            subtask_id uuid default gen_random_uuid() primary key,
            task_id uuid references tasks (task_id),
            subtask_name text not null,
            subtask_state boolean default false,
            subtask_position integer not null default 0,
            created_at timestamp with time zone default now() not null,
            updated_at timestamp with time zone default now() not null,
            deleted_at timestamp with time zone default null
        );
    """)

    op.execute("""
        create index task_subtasks_index on subtasks (task_id);
    """)

    op.execute("""
        create trigger update_subtasks_modtime before update on subtasks for each row execute procedure update_updated_at_column();
    """)


def downgrade() -> None:
    # Удаление таблиц автоматически удалит привязанные к ним триггеры и индексы
    op.execute("drop table if exists subtasks;")
    op.execute("drop table if exists tasks;")
    op.execute("drop table if exists columns;")
    op.execute("drop table if exists boards;")
    op.execute("drop table if exists users;")

    # Функции необходимо удалять явно
    op.execute("drop function if exists soft_delete_task_cascade();")
    op.execute("drop function if exists soft_delete_column_cascade();")
    op.execute("drop function if exists soft_delete_board_cascade();")
    op.execute("drop function if exists update_updated_at_column();")
