import {Subject} from 'rxjs'
import {Entity, UNSAVED_ID} from '../models/entity'
import {NameSaver} from './name-saver'

describe('NameSaver', () => {
  it('creates an unsaved entity once and renames it to the latest name after creation', () => {
    const created$ = new Subject<Entity>()
    const create = vi.fn(() => created$)
    const rename = vi.fn()
    const saver = new NameSaver(create, rename)
    const entity = {id: UNSAVED_ID, name: ''}

    saver.save(entity, 'Первое')
    saver.save(entity, 'Второе')
    expect(create).toHaveBeenCalledTimes(1)

    created$.next({id: 'new-id'})
    created$.complete()

    expect(entity.id).toBe('new-id')
    expect(rename).toHaveBeenCalledExactlyOnceWith('new-id', 'Второе')
  })

  it('renames a saved entity without creating it', () => {
    const create = vi.fn()
    const rename = vi.fn()
    const entity = {id: 'saved-id', name: 'Старое'}

    new NameSaver(create, rename).save(entity, 'Новое')

    expect(create).not.toHaveBeenCalled()
    expect(rename).toHaveBeenCalledExactlyOnceWith('saved-id', 'Новое')
  })
})
