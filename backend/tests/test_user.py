from httpx import AsyncClient

from tests.api import PASSWORD, Api


async def test_profile_updates_given_fields_and_can_clear_them(api: Api) -> None:
    await api.patch(
        "/users/me",
        firstname="Алекс",
        lastname="Ким",
        sex="F",
        dateOfBirth="1991-05-02",
        image="https://example.com/a.png",
    )
    me = await api.ok("GET", "/users/me")
    assert me["firstname"] == "Алекс"
    assert me["lastname"] == "Ким"
    assert me["sex"] == "F"
    assert me["dateOfBirth"] == "1991-05-02"
    assert me["image"] == "https://example.com/a.png"
    assert me["darkTheme"] is False

    await api.patch("/users/me", firstname=None, lastname="  ", dateOfBirth=None, sex=None, image=None)
    cleared = await api.ok("GET", "/users/me")
    assert cleared["firstname"] is None
    assert cleared["lastname"] is None
    assert cleared["dateOfBirth"] is None
    assert cleared["sex"] is None
    assert cleared["image"] is None


async def test_email_is_normalized_and_unique(client: AsyncClient, api: Api) -> None:
    await api.patch("/users/me", email="Owner.New@Example.com")
    assert (await api.ok("GET", "/users/me"))["email"] == "owner.new@example.com"

    other = await Api.sign_up(client, "second@example.com")
    response = await other.request("PATCH", "/users/me", {"email": "owner.new@example.com"})
    assert response.status_code == 409


async def test_password_change_checks_the_current_one(client: AsyncClient, api: Api) -> None:
    wrong = await api.request("PATCH", "/users/me", {"currentPassword": "nope-nope", "newPassword": "another-password"})
    assert wrong.status_code == 400
    missing = await api.request("PATCH", "/users/me", {"newPassword": "another-password"})
    assert missing.status_code == 400

    await api.patch("/users/me", currentPassword=PASSWORD, newPassword="another-password")
    old = await client.post("/api/v1/auth/login", json={"email": "owner@example.com", "password": PASSWORD})
    assert old.status_code == 401
    new = await client.post("/api/v1/auth/login", json={"email": "owner@example.com", "password": "another-password"})
    assert new.status_code == 200
