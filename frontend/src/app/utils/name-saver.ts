import {finalize, Observable} from 'rxjs'
import {Entity, isSaved} from '../models/entity'

interface NamedEntity extends Entity {
  name: string
}

export class NameSaver {
  private creating = false

  constructor(
    private readonly create: (name: string) => Observable<Entity>,
    private readonly rename: (id: string, name: string) => void,
  ) {}

  save(entity: NamedEntity, name: string): void {
    entity.name = name
    if (isSaved(entity)) {
      this.rename(entity.id, name)
      return
    }
    if (this.creating) {
      return
    }
    this.creating = true
    this.create(name)
      .pipe(finalize(() => (this.creating = false)))
      .subscribe(created => {
        entity.id = created.id
        if (entity.name !== name) {
          this.rename(created.id, entity.name)
        }
      })
  }
}
