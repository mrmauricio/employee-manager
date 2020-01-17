import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { EmployeeFormComponent } from "../shared/components/employee-form/employee-form.component";

@NgModule({
    declarations: [EmployeeFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AutocompleteLibModule,
        FontAwesomeModule
    ],
    exports: [EmployeeFormComponent]
})
export class SharedModule {}
