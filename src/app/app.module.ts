import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppRoutingModule } from "./modules/app-routing.module";
import { EmployeeModule } from "./modules/employee.module";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";

@NgModule({
    declarations: [AppComponent, DashboardComponent, SidebarComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        EmployeeModule,
        HttpClientModule,
        FontAwesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
