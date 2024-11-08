import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthEnterpriseGuard, AuthAdminGuard, NoAuthEnterpriseGuard, NoAuthAdminGuard } from './core';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then(m => m.DetailsModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canActivate: [NoAuthEnterpriseGuard, NoAuthAdminGuard]
  },
  {
    path: 'dashboard_Prisma',
    loadChildren: () => import('./dashboard-prisma/dashboard-prisma.module').then(m => m.DashboardPrismaModule),
    canActivate: [AuthEnterpriseGuard]
  },
  {
    path: 'dashboard_TypeORM',
    loadChildren: () => import('./dashboard-type-orm/dashboard-type-orm.module').then(m => m.DashboardTypeORMModule),
    canActivate: [AuthAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
