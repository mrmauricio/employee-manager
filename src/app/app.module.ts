import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./modules/app-routing.module";
import { EmployeeModule } from "./modules/employee.module";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@NgModule({
    declarations: [AppComponent, DashboardComponent],
    imports: [BrowserModule, AppRoutingModule, EmployeeModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
