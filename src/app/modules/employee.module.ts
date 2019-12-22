import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "./shared.module";
import { EmployeeComponent } from "../pages/employee/employee.component";
import { EmployeeEditComponent } from "../pages/employee-edit/employee-edit.component";
import { EmployeeAddComponent } from "../pages/employee-add/employee-add.component";

@NgModule({
    declarations: [
        EmployeeComponent,
        EmployeeEditComponent,
        EmployeeAddComponent
    ],
    imports: [CommonModule, SharedModule],
    exports: [EmployeeComponent, EmployeeEditComponent, EmployeeAddComponent]
})
export class EmployeeModule {}
