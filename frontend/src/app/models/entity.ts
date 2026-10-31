export interface Entity {
  id: string
}

export const UNSAVED_ID = ''

export function isSaved(entity: Entity): boolean {
  return entity.id !== UNSAVED_ID
}

interface Tree extends Entity {
  columns?: Tree[]
  tasks?: Tree[]
  subtasks?: Tree[]
}

export function hasUnsavedItems(tree: Tree): boolean {
  const children = [...(tree.columns ?? []), ...(tree.tasks ?? []), ...(tree.subtasks ?? [])]
  return children.some(child => !isSaved(child) || hasUnsavedItems(child))
}
