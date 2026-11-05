import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {ThemeStore} from './state/theme.store'

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  styles: ':host { display: block; height: 100%; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor() {
    inject(ThemeStore)
  }
}
