export interface Entity {
  id: string
}

const LOCAL_ID_PREFIX = 'local-'

/** Временный id элемента, который ещё не сохранён на сервере. */
export function newLocalId(): string {
  return `${LOCAL_ID_PREFIX}${crypto.randomUUID()}`
}

export function isSaved(entity: Entity): boolean {
  return !entity.id.startsWith(LOCAL_ID_PREFIX)
}

interface Tree extends Entity {
  columns?: readonly Tree[]
  tasks?: readonly Tree[]
  subtasks?: readonly Tree[]
}

export function hasUnsavedItems(tree: Tree): boolean {
  const children = [...(tree.columns ?? []), ...(tree.tasks ?? []), ...(tree.subtasks ?? [])]
  return children.some(child => !isSaved(child) || hasUnsavedItems(child))
}
