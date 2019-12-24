import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    FormArray
} from "@angular/forms";

import { debounceTime } from "rxjs/operators";

import { birthdayValidator } from "../../validators/birthdayValidator";

import { Employee } from "./../../../classes/employee";

//function sameValuesValidator(
//    c: AbstractControl
//): { [key: string]: boolean } | null {
//    if (c["controls"].length === 2) {
//        let values = c["controls"].map(control => control.value.nationality);
//
//        console.log(values);
//    }
//}

@Component({
    selector: "app-employee-form",
    templateUrl: "./employee-form.component.html",
    styleUrls: ["./employee-form.component.scss"]
})
export class EmployeeFormComponent implements OnInit {
    console = console;

    employeeForm: FormGroup;
    employee: Employee;
    controlList: { [key: string]: AbstractControl }[];

    get firstName(): AbstractControl {
        return this.employeeForm.get("firstName");
    }
    get lastName(): AbstractControl {
        return this.employeeForm.get("lastName");
    }
    get birthday(): AbstractControl {
        return this.employeeForm.get("birthday");
    }
    get gender(): AbstractControl {
        return this.employeeForm.get("gender");
    }
    get nationalityList(): FormArray {
        return this.employeeForm.get("nationalityList") as FormArray;
    }
    get email(): AbstractControl {
        return this.employeeForm.get("email");
    }

    displayedMessages: { [key: string]: string } = {
        firstName: "",
        lastName: "",
        birthday: "",
        gender: "",
        nationalityList: "",
        email: ""
    };

    validationMessages: { [key: string]: { [key: string]: string } };

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        // isso virá do backend
        this.validationMessages = {
            firstName: {
                required: "First Name is required",
                minlength: "First Name must have at least three characters."
            },
            lastName: {
                required: "Last Name is required",
                minlength: "Last Name must have at least three characters."
            },
            birthday: {
                required: "Birthday Date is required",
                futureDate: "Birthday Date must be in the past"
            },
            gender: {
                required: "Gender is required"
            },
            nationalityList: {
                required: "Nationality is required"
            },
            email: {
                required: "Email is required",
                email: "Please enter a valid email address"
            }
        };

        this.employeeForm = this.fb.group({
            firstName: ["", [Validators.required, Validators.minLength(3)]],
            lastName: ["", [Validators.required, Validators.minLength(3)]],
            birthday: ["", [Validators.required, birthdayValidator]],
            gender: ["", [Validators.required]],
            nationalityList: this.fb.array([this.buildNationalityList(true)]),
            email: ["", [Validators.required, Validators.email]]
        });

        this.controlList = [
            { firstName: this.firstName },
            { lastName: this.lastName },
            { birthday: this.birthday },
            { gender: this.gender },
            { nationalityList: this.nationalityList },
            { email: this.email }
        ];

        this.controlList.forEach(formControl => {
            let key = Object.keys(formControl)[0];

            formControl[key].valueChanges
                .pipe(debounceTime(1000))
                .subscribe(() => this.setMessage(formControl[key], key));
        });

        //this.firstName.valueChanges
        //    .pipe(debounceTime(1000))
        //    .subscribe(() => this.setMessage(this.firstName, "firstName"));
        //
        //this.lastName.valueChanges
        //    .pipe(debounceTime(1000))
        //    .subscribe(() => this.setMessage(this.lastName, "lastName"));
        //
        //this.birthday.valueChanges
        //    .pipe(debounceTime(1000))
        //    .subscribe(() => this.setMessage(this.birthday, "birthday"));
        //
        //this.gender.valueChanges
        //    .pipe(debounceTime(1000))
        //    .subscribe(() => this.setMessage(this.gender, "gender"));
        //
        //this.nationalityList.valueChanges
        //    .pipe(debounceTime(1000))
        //    .subscribe(() =>
        //        this.setMessage(this.nationalityList, "nationalityList")
        //    );
        //
        //this.email.valueChanges
        //    .pipe(debounceTime(1000))
        //    .subscribe(() => this.setMessage(this.email, "email"));
    }

    buildNationalityList(required: boolean): FormGroup {
        let validators = [];

        if (required) {
            validators.push(Validators.required);
        }

        return this.fb.group({
            nationality: ["", validators]
        });
    }

    handleNationalityAdd(): void {
        this.nationalityList.push(this.buildNationalityList(false));
    }

    handleNationalityDelete(): void {
        this.nationalityList.removeAt(1);
    }

    hasError(c: AbstractControl): boolean {
        if ((c.dirty || c.touched) && c.invalid) {
            return true;
        }

        return false;
    }

    setMessage(c: AbstractControl, name: string): void {
        this.displayedMessages[name] = "";
        if ((c.touched || c.dirty) && c.errors) {
            // pega as chaves do errors do Control e então busca na variavel
            // validationMessages por essa chave, p/ então adicionar a msg
            this.displayedMessages[name] = Object.keys(c.errors)
                .map(key => this.validationMessages[name][key])
                .join(" ");
        }
        console.log(this.displayedMessages[name]);
    }

    submitForm(): void {
        console.log("submit");
    }
}
