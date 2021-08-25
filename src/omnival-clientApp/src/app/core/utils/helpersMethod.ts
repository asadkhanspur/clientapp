import { ValidatorFn, FormControl, AbstractControl, ValidationErrors, FormGroup } from "@angular/forms";




export class HelperMethods {



// *********** Do Not Accept Space in Start on field method *********** //
    static trimValidator: ValidatorFn = (control: FormControl) => {
        if (control.value.startsWith(' ')) {
            return {
                'trimError': { value: 'control has leading whitespace' }
            };
        }
        return null;
    };
// *********** Do Not Accept Space in Start on field method *********** //




// *********** Do Not Accept Space in field method *********** //
static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
    if((control.value as string).indexOf(' ') >= 0){
        return {cannotContainSpace: true}
    }

    return null;
}
// *********** Do Not Accept Space in field method *********** //



// *********** Check Password by Regex *********** //
static checkPassword(control: any) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+{}:\"<>?])/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }
// *********** Check Password by Regex *********** //

// *********** Match Password by Regex *********** //
static MatchPassword(AC: AbstractControl) {
    
    let password = AC.get('password').value;
    if(AC.get('confirmPassword').touched || AC.get('confirmPassword').dirty) {
        let verifyPassword = AC.get('confirmPassword').value;

        if(password != verifyPassword) {
            AC.get('confirmPassword').setErrors( {MatchPassword: true} )
        } else {
            return AC.get('confirmPassword').setErrors( null )
        }
    }
}
// *********** Match Password by Regex *********** //

}
