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
    loadChildren: './entries/entries.module#EntriesPageModule'
  },
  {
    path: 'constraints',
    loadChildren: './constraints/constraints.module#ConstraintsPageModule'
  },
  {
    path: 'generate',
    loadChildren: './generate/generate.module#GeneratePageModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetableRoutingModule {}
