from datetime import timedelta

from httpx import ASGITransport, AsyncClient, Response

from app.main import app
from app.services import auth_service
from tests.api import PASSWORD, Api

REFRESH_URL = "/api/v1/auth/refresh"
COOKIE = "refresh_token"


async def refresh_with(token: str) -> Response:
    """refresh из «другого браузера», у которого есть только этот токен."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        return await client.post(REFRESH_URL, headers={"Cookie": f"{COOKIE}={token}"})


async def test_register_returns_access_token_and_sets_refresh_cookie(client: AsyncClient) -> None:
    response = await client.post("/api/v1/auth/register", json={"email": "New@Example.com", "password": PASSWORD})

    assert response.status_code == 201
    body = response.json()
    assert body["tokenType"] == "bearer"
    assert body["expiresIn"] == 15 * 60
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie
    assert "path=/api/v1/auth" in cookie
    assert "samesite=strict" in cookie

    me = await Api(client, body["accessToken"]).ok("GET", "/users/me")
    assert me["email"] == "new@example.com"


async def test_register_rejects_taken_email(client: AsyncClient, api: Api) -> None:
    response = await client.post("/api/v1/auth/register", json={"email": "OWNER@example.com", "password": PASSWORD})

    assert response.status_code == 409


async def test_login_checks_password(client: AsyncClient, api: Api) -> None:
    wrong = await client.post("/api/v1/auth/login", json={"email": "owner@example.com", "password": "wrong-password"})
    unknown = await client.post("/api/v1/auth/login", json={"email": "nobody@example.com", "password": PASSWORD})
    right = await client.post("/api/v1/auth/login", json={"email": "owner@example.com", "password": PASSWORD})

    assert (wrong.status_code, unknown.status_code, right.status_code) == (401, 401, 200)


async def test_api_requires_valid_access_token(client: AsyncClient) -> None:
    missing = await client.get("/api/v1/users/me")
    invalid = await client.get("/api/v1/users/me", headers={"Authorization": "Bearer not-a-jwt"})

    assert (missing.status_code, invalid.status_code) == (401, 401)
    assert missing.headers["www-authenticate"] == "Bearer"


async def test_refresh_token_cannot_be_used_as_access_token(client: AsyncClient, api: Api) -> None:
    response = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {client.cookies.get(COOKIE)}"})

    assert response.status_code == 401


async def test_refresh_rotates_refresh_token(client: AsyncClient, api: Api) -> None:
    first = client.cookies.get(COOKIE)

    response = await client.post(REFRESH_URL)

    assert response.status_code == 200
    assert client.cookies.get(COOKIE) != first
    await Api(client, response.json()["accessToken"]).ok("GET", "/users/me")


async def test_recently_rotated_token_is_accepted_again(client: AsyncClient, api: Api) -> None:
    lost = client.cookies.get(COOKIE)
    rotated = await refresh_with(lost)
    assert rotated.status_code == 200

    replayed = await refresh_with(lost)

    assert replayed.status_code == 200
    assert (await refresh_with(rotated.cookies[COOKIE])).status_code == 200
    assert (await refresh_with(replayed.cookies[COOKIE])).status_code == 200


async def test_reuse_after_the_interval_revokes_all_sessions(client: AsyncClient, api: Api, monkeypatch) -> None:
    monkeypatch.setattr(auth_service, "REFRESH_REUSE_INTERVAL", timedelta(0))
    stolen = client.cookies.get(COOKIE)
    current = (await refresh_with(stolen)).cookies[COOKIE]

    reused = await refresh_with(stolen)

    assert reused.status_code == 401
    assert (await refresh_with(current)).status_code == 401


async def test_logout_revokes_refresh_token_immediately(client: AsyncClient, api: Api) -> None:
    token = client.cookies.get(COOKIE)

    response = await client.post("/api/v1/auth/logout")

    assert response.status_code == 204
    assert client.cookies.get(COOKIE) is None
    assert (await refresh_with(token)).status_code == 401
