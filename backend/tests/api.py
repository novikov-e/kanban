from dataclasses import dataclass
from typing import Any

from httpx import AsyncClient, Response

PASSWORD = "correct-horse-battery"


@dataclass
class Api:
    """Клиент API от имени одного пользователя: подставляет access-токен и проверяет коды ответов."""

    client: AsyncClient
    access_token: str

    @classmethod
    async def sign_up(cls, client: AsyncClient, email: str) -> "Api":
        response = await client.post("/api/v1/auth/register", json={"email": email, "password": PASSWORD})
        assert response.status_code == 201, response.text
        return cls(client, response.json()["accessToken"])

    @property
    def headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self.access_token}"}

    async def request(self, method: str, url: str, json: Any = None, headers: dict[str, str] | None = None) -> Response:
        return await self.client.request(
            method, f"/api/v1{url}", json=json, headers={**self.headers, **(headers or {})}
        )

    async def ok(self, method: str, url: str, json: Any = None, status: int = 200) -> Any:
        response = await self.request(method, url, json)
        assert response.status_code == status, response.text
        return response.json() if response.content else None

    async def create_board(self) -> dict[str, Any]:
        return await self.ok("POST", "/boards", status=201)

    async def board(self, board_id: str) -> dict[str, Any]:
        return await self.ok("GET", f"/boards/{board_id}")

    async def create_column(self, board_id: str, name: str = "Колонка") -> dict[str, Any]:
        return await self.ok("POST", f"/boards/{board_id}/columns", {"name": name}, status=201)

    async def create_task(self, column_id: str, name: str = "Список") -> dict[str, Any]:
        return await self.ok("POST", f"/columns/{column_id}/tasks", {"name": name}, status=201)

    async def create_subtask(self, task_id: str, name: str = "Задача") -> dict[str, Any]:
        return await self.ok("POST", f"/tasks/{task_id}/subtasks", {"name": name}, status=201)

    async def patch(self, url: str, **fields: Any) -> None:
        await self.ok("PATCH", url, fields, status=204)


def names(items: list[dict[str, Any]]) -> list[str]:
    return [item["name"] for item in items]
