import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EmployeeFormComponent } from "../shared/components/employee-form/employee-form.component";

@NgModule({
    declarations: [EmployeeFormComponent],
    imports: [CommonModule],
    exports: [ReactiveFormsModule, FormsModule, EmployeeFormComponent]
})
export class SharedModule {}
