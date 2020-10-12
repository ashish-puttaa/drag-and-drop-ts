// Validation

export interface Validatable {
   value: string | number;
   required?: boolean;
   minLength?: number;
   maxLength?: number;
   min?: number;
   max?: number;
}

export function validate(validatableInput: Validatable) {
   let isValid = true;

   if (validatableInput.required) {
      isValid = isValid && validatableInput.value.toString().trim().length !== 0;
   }

   if (typeof validatableInput.value === 'string') {
      const { value, minLength, maxLength } = validatableInput;

      if (minLength != null) isValid = isValid && value.length >= minLength;
      if (maxLength != null) isValid = isValid && value.length <= maxLength;
   }

   if (typeof validatableInput.value === 'number') {
      const { value, min, max } = validatableInput;

      if (min != null && typeof value === 'number') isValid = isValid && value >= min;
      if (max != null && typeof value === 'number') isValid = isValid && value <= max;
   }

   return isValid;
}
