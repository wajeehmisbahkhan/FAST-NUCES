import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'entries',
    pathMatch: 'full'
  },
  {
    path: 'entries',
    loadChildren: () =>
      import('./entries/entries.module').then(m => m.EntriesPageModule)
  },
  {
    path: 'pair-elective-courses',
    loadChildren: () =>
      import('./constraints/constraints.module').then(
        m => m.ConstraintsPageModule
      )
  },
  {
    path: 'generate',
    loadChildren: () =>
      import('./generate/generate.module').then(m => m.GeneratePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetableRoutingModule {}
