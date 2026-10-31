class NotFoundError(Exception):
    def __init__(self, entity: str):
        super().__init__(f"{entity} not found")
        self.entity = entity


class AuthError(Exception):
    pass


class ConflictError(Exception):
    pass
