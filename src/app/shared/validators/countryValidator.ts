import { AbstractControl } from "@angular/forms";
import { createVerify } from "crypto";

export function countryValidator(
    c: AbstractControl
): { [key: string]: boolean } | null {
    let valueExists = this.countryList.data.filter(
        country => country === c.value
    );

    if (c.pristine || valueExists.length !== 0) {
        return null;
    }

    return { notExists: true };
}

export function sameCountryValidator(
    c: AbstractControl
): { [key: string]: boolean } | null {
    if (
        c.value.length !== 2 ||
        c.value[0].nationality !== c.value[1].nationality
    ) {
        return null;
    }

    return { sameCountry: true };
}
