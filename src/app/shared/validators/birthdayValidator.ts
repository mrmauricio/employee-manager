import { AbstractControl } from "@angular/forms";

export function birthdayValidator(
    c: AbstractControl
): { [key: string]: boolean } | null {
    // não dá erro se não foi mexido OU a data escrita está incompleta
    // OU a data escrita é menor que a atual
    if (c.pristine || !c.value || new Date() >= new Date(c.value)) {
        return null;
    }

    return { futureDate: true };
}
