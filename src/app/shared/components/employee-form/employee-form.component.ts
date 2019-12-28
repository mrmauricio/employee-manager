import { Component, OnInit } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
    FormControl,
    FormArray
} from "@angular/forms";

import { debounceTime } from "rxjs/operators";

import { birthdayValidator } from "../../validators/birthdayValidator";
import {
    countryValidator,
    sameCountryValidator
} from "../../validators/countryValidator";
import { passwordValidator } from "../../validators/passwordValidator";

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
        nationalityGroup: [],
        email: [],
        password: [],
        passwordGroup: []
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
    get nationalityArray(): FormArray {
        return this.employeeForm.get("nationalityArray") as FormArray;
    }
    get email(): AbstractControl {
        return this.employeeForm.get("email");
    }
    get passwordGroup(): AbstractControl {
        return this.employeeForm.get("passwordGroup");
    }
    get password(): AbstractControl {
        return this.employeeForm.get("passwordGroup.password");
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
            nationalityGroup: {
                sameCountry: "Please select different nationalities."
            },
            nationality: {
                required: "Nationality is required.",
                notExists: "Please select a country from the list."
            },
            email: {
                required: "Email is required.",
                email: "Please enter a valid email address."
            },
            passwordGroup: {
                differentPasswords:
                    "Passwords are not matching. Please verify it."
            },
            password: {
                required: "Password is required.",
                minlength: "Password must have at least eigth characters."
            }
        };

        this.employeeForm = this.fb.group({
            firstName: ["", [Validators.required, Validators.minLength(3)]],
            lastName: ["", [Validators.required, Validators.minLength(3)]],
            birthday: ["", [Validators.required, birthdayValidator]],
            gender: ["", [Validators.required]],
            nationalityArray: this.fb.array(
                [this.buildNationalityGroup(true)],
                { validators: sameCountryValidator }
            ),
            email: ["", [Validators.required, Validators.email]],
            passwordGroup: this.fb.group(
                {
                    password: [
                        "",
                        [Validators.required, Validators.minLength(8)]
                    ],
                    confirmPassword: [""]
                },
                { validator: passwordValidator }
            )
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
            { nationalityGroup: this.nationalityArray },
            { email: this.email },
            { passwordGroup: this.passwordGroup },
            { password: this.password }
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
                nationality: this.nationalityArray.controls[0]["controls"]
                    .nationality
            }
        ];

        this.handleFormArraySubscription(this.arrayList);
    }

    buildNationalityGroup(main: boolean): FormGroup {
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
            let num = this.nationalityArray.length;

            formControl[key].valueChanges
                .pipe(debounceTime(1000))
                .subscribe(() => this.setMessage(formControl[key], key, num));
        });
    }

    handleNationalityAdd(): void {
        this.nationalityArray.push(this.buildNationalityGroup(false));

        let controlList = [
            {
                nationality: this.nationalityArray.controls[
                    this.nationalityArray.length - 1
                ]["controls"].nationality
            }
        ];

        this.handleFormArraySubscription(controlList);
    }

    handleNationalityDelete(): void {
        this.nationalityArray.removeAt(1);
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
