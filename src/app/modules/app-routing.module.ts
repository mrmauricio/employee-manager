import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { EmployeeComponent } from "../pages/employee/employee.component";
import { EmployeeEditComponent } from "./../pages/employee-edit/employee-edit.component";
import { EmployeeAddComponent } from "./../pages/employee-add/employee-add.component";

const routes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent
    },
    {
        path: "employees/add",
        component: EmployeeAddComponent
    },
    {
        path: "employees/:id",
        component: EmployeeComponent
    },
    {
        path: "employees/:id/edit",
        component: EmployeeEditComponent
    },
    {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
    },
    {
        path: "**",
        redirectTo: "dashboard",
        pathMatch: "full"
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
