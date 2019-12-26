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
import {
    countryValidator,
    sameCountryValidator
} from "../../validators/countryValidator";

import { Employee } from "./../../../classes/employee";

import { FormService } from "./../../../services/form.service";

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
    arrayList: { [key: string]: AbstractControl }[];

    validationMessages;
    displayedMessages = {
        firstName: [],
        lastName: [],
        birthday: [],
        gender: [],
        nationality: [],
        email: []
    };

    countryList = {
        keyword: "name",
        data: []
    };

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

    constructor(private fb: FormBuilder, private formService: FormService) {}

    ngOnInit() {
        // isso virá do backend
        this.validationMessages = {
            firstName: {
                required: "First Name is required.",
                minlength: "First Name must have at least three characters."
            },
            lastName: {
                required: "Last Name is required.",
                minlength: "Last Name must have at least three characters."
            },
            birthday: {
                required: "Birthday Date is required.",
                futureDate: "Birthday Date must be in the past."
            },
            gender: {
                required: "Gender is required."
            },
            nationality: {
                required: "Nationality is required.",
                notExists: "Please select a country of the list.",
                sameCountry: "Please select different nacionalities."
            },
            email: {
                required: "Email is required.",
                email: "Please enter a valid email address."
            }
        };

        this.employeeForm = this.fb.group({
            firstName: ["", [Validators.required, Validators.minLength(3)]],
            lastName: ["", [Validators.required, Validators.minLength(3)]],
            birthday: ["", [Validators.required, birthdayValidator]],
            gender: ["", [Validators.required]],
            nationalityList: this.fb.array(
                [this.buildNationalityList(true)],
                sameCountryValidator
            ),
            email: ["", [Validators.required, Validators.email]]
        });

        // fetch data from api
        this.getCountryList();

        /*
         ** subscribe to each of the formControl's value changes
         */

        this.controlList = [
            { firstName: this.firstName },
            { lastName: this.lastName },
            { birthday: this.birthday },
            { gender: this.gender },
            { nationality: this.nationalityList },
            { email: this.email }
        ];

        this.controlList.forEach(formControl => {
            let key = Object.keys(formControl)[0];

            formControl[key].valueChanges
                .pipe(debounceTime(1000))
                .subscribe(() => this.setMessage(formControl[key], key, null));
        });

        /*
         ** subscribe to each of the formArrays's value changes
         */

        this.arrayList = [
            {
                nationality: this.nationalityList.controls[0]["controls"]
                    .nationality
            }
        ];

        this.handleFormArraySubscription(this.arrayList);
    }

    buildNationalityList(main: boolean): FormGroup {
        let validators = [countryValidator.bind(this)];

        if (main) {
            // only the first nationality field is required
            validators.push(Validators.required);
        }

        return this.fb.group({
            nationality: ["", validators]
        });
    }

    getCountryList() {
        this.formService.getCountryList().subscribe({
            next: countryList => (this.countryList.data = countryList),
            error: err => this.console.log(err)
        });
    }

    handleFormArraySubscription(
        controlList: { [key: string]: AbstractControl }[]
    ) {
        controlList.forEach(formControl => {
            let key = Object.keys(formControl)[0];
            let num = this.nationalityList.length;

            formControl[key].valueChanges
                .pipe(debounceTime(1000))
                .subscribe(() => this.setMessage(formControl[key], key, num));
        });
    }

    handleNationalityAdd(): void {
        this.nationalityList.push(this.buildNationalityList(false));

        let controlList = [
            {
                nationality: this.nationalityList.controls[
                    this.nationalityList.length - 1
                ]["controls"].nationality
            }
        ];

        this.handleFormArraySubscription(controlList);
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

    setMessage(c: AbstractControl, name: string, id: number | null): void {
        let controlName: string;

        if (id) {
            controlName = `${name}${id}`;
        } else {
            controlName = name;
        }

        this.displayedMessages[controlName] = [];

        if ((c.touched || c.dirty) && c.errors) {
            let keys = Object.keys(c.errors);

            this.displayedMessages[controlName] = keys.map(
                key => this.validationMessages[name][key]
            );
        }
        //console.log(c);
        //console.log(this.displayedMessages);
    }

    submitForm(): void {
        console.log("submit");
    }
}
