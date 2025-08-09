import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(
        (m) => m.Dashboard,
      ),
  },
  {
    path: '**',
    redirectTo: 'app',
  }

];
