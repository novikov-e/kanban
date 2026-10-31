import {ChangeDetectionStrategy, Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  styles: ':host { display: block; height: 100%; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent {}
