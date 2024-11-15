import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent, HeaderComponent, SharedModule, HeaderUserEnterpriseComponent, HeaderUserAdminComponent } from './shared';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { ShopModule } from './shop/shop.module';
import { DetailsModule } from './details/details.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardPrismaModule } from './dashboard-prisma/dashboard-prisma.module';
import { DashboardTypeORMModule } from './dashboard-type-orm/dashboard-type-orm.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HeaderUserEnterpriseComponent,
    HeaderUserAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    CoreModule,
    HttpClientModule,
    ShopModule,
    DetailsModule,
    NgbModule,
    AuthModule,
    ProfileModule,
    SettingsModule,
    DashboardPrismaModule,
    DashboardTypeORMModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
