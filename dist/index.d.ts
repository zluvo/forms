declare class FieldError extends Error {
    constructor(message: string);
}
declare abstract class Field {
    name?: string;
    label: string;
    type: string;
    placeholder: string;
    value?: any;
    maxlength?: number;
    min?: number;
    max?: number;
    required?: boolean;
    errorMessage?: string;
    constructor(label: string, type: string, placeholder: string, maxlength?: number, min?: number, max?: number, required?: boolean, errorMessage?: string);
    validate(value: string): void;
    abstract cast(value?: string): any;
}
/**
 * Field for text based inputs
 */
declare class TextField extends Field {
    value?: string;
    constructor(params: {
        label: string;
        placeholder: string;
        maxlength?: number;
        required?: boolean;
        errorMessage?: string;
    });
    cast(value?: string): string | null;
    validate(value: string): void;
}
/**
 * Field for number based inputs
 */
declare class NumberField extends Field {
    value?: number;
    constructor(params: {
        label: string;
        placeholder: string;
        min?: number;
        max?: number;
        required?: boolean;
        errorMessage?: string;
    });
    validate(value: string): void;
    cast(value?: string): number | null;
}
/**
 * Field for textarea based inputs
 */
declare class TextAreaField extends TextField {
    type: "textarea";
}
/**
 * Field for email based inputs
 */
declare class EmailField extends TextField {
    type: "email";
    validate(value: string): void;
}
/**
 * Field for password based inputs
 */
declare class PasswordField extends TextField {
    type: "password";
}
/**
 * Field for url based inputs
 */
declare class UrlField extends TextField {
    type: "url";
    validate(value: string): void;
}
/**
 * Field for checkbox based inputs
 */
declare class CheckboxField extends Field {
    value?: boolean;
    constructor(params: {
        label: string;
        placeholder: string;
        required?: boolean;
        errorMessage?: string;
    });
    validate(value: string): void;
    cast(value?: string): boolean | null;
}

/**
 * Class for creating a custom form
 */
declare class Form {
    /**
     * Error message when value is not a number
     */
    static errorMessages: {
        number: string;
        email: string;
        url: string;
        checkbox: string;
        required: string;
        maxLength: string;
        min: string;
        max: string;
    };
    static settings: {
        strict: boolean;
        record: boolean;
    };
    /**
     * @returns an iterable of fields to display on the frontend
     */
    static fields(): Field[];
    /**
     * @param formData to first validate then parse to the appropiate type for backend logic
     * @returns whether the form was valid, a message if the form was invalid, and the data if the form was valid
     */
    static consume<Type>(formData: FormData): {
        data?: Type;
        errorMessage?: string;
    };
}

export { CheckboxField, EmailField, Field, FieldError, Form, NumberField, PasswordField, TextAreaField, TextField, UrlField };
