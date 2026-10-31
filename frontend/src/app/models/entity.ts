export interface Entity {
  id: string
}

export const UNSAVED_ID = ''

export function isSaved(entity: Entity): boolean {
  return entity.id !== UNSAVED_ID
}
