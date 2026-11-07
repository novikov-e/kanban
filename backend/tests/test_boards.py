from httpx import AsyncClient

from tests.api import Api, names


async def test_new_board_appears_in_the_user_list(api: Api) -> None:
    board = await api.create_board()

    me = await api.ok("GET", "/users/me")

    assert board["name"] == "Новая доска"
    assert board["columns"] == []
    assert [item["id"] for item in me["boards"]] == [board["id"]]


async def test_patch_changes_only_given_fields(api: Api) -> None:
    board = await api.create_board()
    column = await api.create_column(board["id"])
    task = await api.create_task(column["id"], "Список")

    await api.patch(f"/tasks/{task['id']}", color=5)

    saved = (await api.board(board["id"]))["columns"][0]["tasks"][0]
    assert (saved["name"], saved["color"]) == ("Список", 5)


async def test_task_color_is_validated(api: Api) -> None:
    board = await api.create_board()
    column = await api.create_column(board["id"])
    task = await api.create_task(column["id"])

    response = await api.request("PATCH", f"/tasks/{task['id']}", {"color": 9})

    assert response.status_code == 422


async def test_deleting_a_column_removes_its_tasks(api: Api) -> None:
    board = await api.create_board()
    kept = await api.create_column(board["id"], "Остаётся")
    removed = await api.create_column(board["id"], "Удаляется")
    task = await api.create_task(removed["id"])

    await api.ok("DELETE", f"/columns/{removed['id']}", status=204)

    assert names((await api.board(board["id"]))["columns"]) == ["Остаётся"]
    assert (await api.request("PATCH", f"/tasks/{task['id']}", {"name": "x"})).status_code == 404
    assert (await api.request("POST", f"/columns/{kept['id']}/tasks", {"name": "x"})).status_code == 201


async def test_deleting_the_last_board_forgets_it(api: Api) -> None:
    board = await api.create_board()
    await api.patch("/users/me", lastBoardId=board["id"])
    assert (await api.ok("GET", "/users/me"))["lastBoard"] == board["id"]

    await api.ok("DELETE", f"/boards/{board['id']}", status=204)

    me = await api.ok("GET", "/users/me")
    assert me["lastBoard"] is None
    assert me["boards"] == []


async def test_board_supports_conditional_requests(api: Api) -> None:
    board = await api.create_board()
    first = await api.request("GET", f"/boards/{board['id']}")
    etag = first.headers["etag"]

    unchanged = await api.request("GET", f"/boards/{board['id']}", headers={"If-None-Match": etag})
    await api.patch(f"/boards/{board['id']}", name="Переименован")
    changed = await api.request("GET", f"/boards/{board['id']}", headers={"If-None-Match": etag})

    assert unchanged.status_code == 304
    assert changed.status_code == 200
    assert changed.headers["etag"] != etag
    assert changed.json()["name"] == "Переименован"


async def test_health_checks_the_database(client: AsyncClient) -> None:
    response = await client.get("/health")

    assert (response.status_code, response.json()) == (200, {"status": "ok"})
