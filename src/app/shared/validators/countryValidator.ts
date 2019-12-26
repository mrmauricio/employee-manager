import { AbstractControl } from "@angular/forms";

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
