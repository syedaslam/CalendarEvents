import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalanderViewComponent } from './calendar/calander-view/calander-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full'
  },
  {
    path: 'calendar',
    component: CalanderViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
