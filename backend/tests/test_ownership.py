from tests.api import Api, names


async def test_foreign_items_look_missing(api: Api, stranger: Api) -> None:
    board = await api.create_board()
    column = await api.create_column(board["id"])
    task = await api.create_task(column["id"])
    subtask = await api.create_subtask(task["id"])
    attempts = [
        ("GET", f"/boards/{board['id']}", None),
        ("PATCH", f"/boards/{board['id']}", {"name": "Чужое"}),
        ("DELETE", f"/boards/{board['id']}", None),
        ("POST", f"/boards/{board['id']}/columns", {"name": "Чужое"}),
        ("PATCH", f"/columns/{column['id']}", {"name": "Чужое"}),
        ("DELETE", f"/columns/{column['id']}", None),
        ("POST", f"/columns/{column['id']}/tasks", {"name": "Чужое"}),
        ("PATCH", f"/tasks/{task['id']}", {"color": 3}),
        ("DELETE", f"/tasks/{task['id']}", None),
        ("POST", f"/tasks/{task['id']}/subtasks", {"name": "Чужое"}),
        ("PATCH", f"/subtasks/{subtask['id']}", {"state": True}),
        ("DELETE", f"/subtasks/{subtask['id']}", None),
        ("PATCH", "/users/me", {"lastBoardId": board["id"]}),
    ]

    for method, url, body in attempts:
        response = await stranger.request(method, url, body)
        assert response.status_code == 404, f"{method} {url}: {response.status_code}"

    unchanged = await api.board(board["id"])
    assert unchanged["name"] == board["name"]
    assert names(unchanged["columns"]) == ["Колонка"]
    assert names(unchanged["columns"][0]["tasks"]) == ["Список"]
    assert unchanged["columns"][0]["tasks"][0]["subtasks"][0]["state"] is False


async def test_items_cannot_be_moved_into_foreign_parents(api: Api, stranger: Api) -> None:
    own_board = await api.create_board()
    own_column = await api.create_column(own_board["id"])
    own_task = await api.create_task(own_column["id"])
    own_subtask = await api.create_subtask(own_task["id"])
    foreign_board = await stranger.create_board()
    foreign_column = await stranger.create_column(foreign_board["id"])
    foreign_task = await stranger.create_task(foreign_column["id"])
    moves = [
        (f"/columns/{own_column['id']}", {"boardId": foreign_board["id"], "index": 0}),
        (f"/tasks/{own_task['id']}", {"columnId": foreign_column["id"], "index": 0}),
        (f"/subtasks/{own_subtask['id']}", {"taskId": foreign_task["id"], "index": 0}),
    ]

    for url, body in moves:
        response = await api.request("PATCH", url, body)
        assert response.status_code == 404, f"PATCH {url}: {response.status_code}"

    foreign = await stranger.board(foreign_board["id"])
    assert names(foreign["columns"]) == ["Колонка"]
    assert names(foreign["columns"][0]["tasks"]) == ["Список"]
    assert foreign["columns"][0]["tasks"][0]["subtasks"] == []
