import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'public',
    loadChildren: () =>
      import('./public/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
