import asyncio

from app.jobs.rebalance_positions import rebalance_all
from tests.api import Api, names


async def board_with_columns(api: Api, *column_names: str) -> tuple[str, dict[str, str]]:
    board = await api.create_board()
    ids = {name: (await api.create_column(board["id"], name))["id"] for name in column_names}
    return board["id"], ids


async def column_names(api: Api, board_id: str) -> list[str]:
    return names((await api.board(board_id))["columns"])


async def test_new_items_are_added_to_the_end(api: Api) -> None:
    board_id, _ = await board_with_columns(api, "A", "B", "C")

    columns = (await api.board(board_id))["columns"]

    assert names(columns) == ["A", "B", "C"]
    assert [column["position"] for column in columns] == sorted(column["position"] for column in columns)


async def test_index_is_the_final_place_in_the_list(api: Api) -> None:
    board_id, ids = await board_with_columns(api, "A", "B", "C", "D")

    await api.patch(f"/columns/{ids['A']}", index=2)
    assert await column_names(api, board_id) == ["B", "C", "A", "D"]

    await api.patch(f"/columns/{ids['D']}", index=0)
    assert await column_names(api, board_id) == ["D", "B", "C", "A"]

    await api.patch(f"/columns/{ids['B']}", index=99)
    assert await column_names(api, board_id) == ["D", "C", "A", "B"]


async def test_task_moves_to_another_column(api: Api) -> None:
    board_id, ids = await board_with_columns(api, "Первая", "Вторая")
    first = await api.create_task(ids["Первая"], "1")
    await api.create_task(ids["Первая"], "2")
    await api.create_task(ids["Вторая"], "3")

    await api.patch(f"/tasks/{first['id']}", columnId=ids["Вторая"], index=1)

    columns = (await api.board(board_id))["columns"]
    assert [names(column["tasks"]) for column in columns] == [["2"], ["3", "1"]]


async def test_subtask_moves_to_another_task(api: Api) -> None:
    board_id, ids = await board_with_columns(api, "Колонка")
    source = await api.create_task(ids["Колонка"], "Откуда")
    target = await api.create_task(ids["Колонка"], "Куда")
    moved = await api.create_subtask(source["id"], "Переезжает")
    await api.create_subtask(target["id"], "Уже здесь")

    await api.patch(f"/subtasks/{moved['id']}", taskId=target["id"], index=0)

    tasks = (await api.board(board_id))["columns"][0]["tasks"]
    assert [names(task["subtasks"]) for task in tasks] == [[], ["Переезжает", "Уже здесь"]]


async def test_repeated_moves_into_the_same_gap_keep_the_order(api: Api) -> None:
    """Каждая вставка делит промежуток пополам; когда точности double не хватает, список перенумеровывается."""
    board_id, ids = await board_with_columns(api, "Начало", "Конец")
    inserted = []
    for number in range(80):
        column = await api.create_column(board_id, str(number))
        await api.patch(f"/columns/{column['id']}", index=1)
        inserted.append(str(number))

    assert await column_names(api, board_id) == ["Начало", *reversed(inserted), "Конец"]


async def test_concurrent_moves_get_distinct_positions(api: Api) -> None:
    board_id, ids = await board_with_columns(api, "Колонка")
    tasks = [await api.create_task(ids["Колонка"], str(number)) for number in range(12)]

    await asyncio.gather(*(api.patch(f"/tasks/{task['id']}", index=0) for task in tasks))

    moved = (await api.board(board_id))["columns"][0]["tasks"]
    positions = [task["position"] for task in moved]
    assert len(moved) == 12
    assert len(set(positions)) == 12


async def test_daily_rebalance_renumbers_without_changing_the_order(api: Api) -> None:
    board_id, ids = await board_with_columns(api, "A", "B", "C")
    await api.patch(f"/columns/{ids['C']}", index=1)
    await api.patch(f"/columns/{ids['B']}", index=1)
    before = await column_names(api, board_id)

    await rebalance_all()

    columns = (await api.board(board_id))["columns"]
    assert names(columns) == before == ["A", "B", "C"]
    assert [column["position"] for column in columns] == [1.0, 2.0, 3.0]
