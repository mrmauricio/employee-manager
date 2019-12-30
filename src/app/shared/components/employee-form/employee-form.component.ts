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

    arrayKeysToValidate = {
        addressArray: ["addressType", "street1", "zip", "city", "country"],
        nationalityArray: ["nationality"]
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
    get addressArray(): FormArray {
        return this.employeeForm.get("addressArray") as FormArray;
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
            },
            addressType: {
                required: "Address Type is required."
            },
            street1: {
                required: "Street 1 is required."
            },
            zip: {
                required: "Zip is required."
            },
            city: {
                required: "City is required."
            },
            country: {
                required: "Country is required.",
                notExists: "Please select a country from the list."
            }
        };

        // create form group
        this.employeeForm = this.fb.group({
            firstName: ["", [Validators.required, Validators.minLength(3)]],
            lastName: ["", [Validators.required, Validators.minLength(3)]],
            birthday: ["", [Validators.required, birthdayValidator]],
            gender: ["", [Validators.required]],
            nationalityArray: this.fb.array([], {
                validators: sameCountryValidator
            }),
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
            ),
            addressArray: this.fb.array([])
        });

        // add first data and subscriptions to form arrays
        this.handleArrayAdd("nationalityArray", this.nationalityArray);
        this.handleArrayAdd("addressArray", this.addressArray);

        // fetch data from api
        this.getCountryList();

        // add subscriptions to form controls/groups
        let controlList: { [key: string]: AbstractControl }[] = [
            { firstName: this.firstName },
            { lastName: this.lastName },
            { birthday: this.birthday },
            { gender: this.gender },
            { nationalityGroup: this.nationalityArray },
            { email: this.email },
            { passwordGroup: this.passwordGroup },
            { password: this.password }
        ];
        this.handleSubscription("FormControl", controlList, null);
    }

    buildGroup(groupName: string, required: boolean): FormGroup {
        switch (groupName) {
            case "addressArray":
                return this.fb.group({
                    addressType: ["", Validators.required],
                    street1: ["", Validators.required],
                    street2: [""],
                    zip: ["", Validators.required],
                    city: ["", Validators.required],
                    country: [
                        "",
                        [Validators.required, countryValidator.bind(this)]
                    ]
                });
            case "nationalityArray":
                let validators = [countryValidator.bind(this)];

                if (required) {
                    // only the first nationality field is required
                    validators.push(Validators.required);
                }

                return this.fb.group({
                    nationality: ["", validators]
                });
            default:
                break;
        }
    }

    getCountryList() {
        this.formService.getCountryList().subscribe({
            next: countryList => (this.countryList.data = countryList),
            error: err => this.console.log(err)
        });
    }

    handleSubscription(
        type: string,
        controlList: { [key: string]: AbstractControl }[],
        formArrayLength: number | null
    ) {
        let id: number;

        switch (type) {
            case "FormArray":
                id = formArrayLength;
                break;
            case "FormControl":
                id = null;
                break;
            default:
                break;
        }

        controlList.forEach(formControl => {
            let key = Object.keys(formControl)[0];

            formControl[key].valueChanges
                .pipe(debounceTime(1000))
                .subscribe(() => this.setMessage(formControl[key], key, id));
        });
    }

    handleArrayAdd(arrayName: string, formArray: FormArray): void {
        let id = formArray.length + 1;
        let required: boolean = false;

        if (arrayName === "nationalityArray" && id === 1) {
            required = true;
        }

        let keys = this.arrayKeysToValidate[arrayName];

        keys.forEach(key => {
            this.displayedMessages[`${key}_${id}`] = [];
        });

        formArray.push(this.buildGroup(arrayName, required));

        let controlList = keys.map(key => {
            return {
                [key]: formArray.controls[id - 1].get(key)
            };
        });

        this.handleSubscription("FormArray", controlList, formArray.length);
    }

    handleArrayDelete(
        arrayName: string,
        formArray: FormArray,
        id: number
    ): void {
        formArray.removeAt(id);

        // synchro displayed messages with array after removed item
        this.arrayKeysToValidate[arrayName].forEach(key => {
            for (let i = 1; i < formArray.length + 1; i++) {
                if (i >= id + 1) {
                    this.displayedMessages[
                        `${key}_${i}`
                    ] = this.displayedMessages[`${key}_${i + 1}`];
                }
            }
        });
    }

    setMessage(c: AbstractControl, name: string, id: number | null): void {
        let controlName: string;
        id ? (controlName = `${name}_${id}`) : (controlName = name);

        this.displayedMessages[controlName] = [];

        if ((c.touched || c.dirty) && c.errors) {
            let keys = Object.keys(c.errors);

            this.displayedMessages[controlName] = keys.map(
                key => this.validationMessages[name][key]
            );
        }
    }

    submitForm(): void {
        console.log("submit");
    }
}
