import { AbstractControl } from "@angular/forms";

export function passwordValidator(
    c: AbstractControl
): { [key: string]: boolean } | null {
    let password = c.get("password");
    let confirmPassword = c.get("confirmPassword");

    if (
        password.value === confirmPassword.value ||
        password.pristine ||
        confirmPassword.pristine
    ) {
        return null;
    }

    return { differentPasswords: true };
}
