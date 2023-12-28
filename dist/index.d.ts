declare class FieldError extends Error {
    constructor(message: string);
}
declare abstract class Field {
    label: string;
    type: string;
    placeholder: string;
    value?: unknown;
    maxlength?: number;
    min?: number;
    max?: number;
    required?: boolean;
    error?: string;
    constructor(label: string, type: string, placeholder: string, maxlength?: number, min?: number, max?: number, required?: boolean, error?: string);
    abstract cast(): void;
    abstract validate(): void;
}
/**
 * Field for text based inputs
 */
declare class TextField extends Field {
    value?: string | null;
    constructor(params: {
        value?: string;
        label: string;
        placeholder: string;
        maxlength?: number;
        required?: boolean;
        error?: string;
    });
    cast(): void;
    validate(): void;
}
/**
 * Field for number based inputs
 */
declare class NumberField extends Field {
    value?: number | null;
    constructor(params: {
        value?: number;
        label: string;
        placeholder: string;
        min?: number;
        max?: number;
        required?: boolean;
        error?: string;
    });
    cast(): void;
    validate(): void;
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
    validate(): void;
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
    validate(): void;
}
/**
 * Field for checkbox based inputs
 */
declare class CheckboxField extends Field {
    value?: "true" | "false" | boolean | null;
    constructor(params: {
        value?: boolean;
        label: string;
        placeholder: string;
        required?: boolean;
        error?: string;
    });
    cast(): void;
    validate(): void;
}

/**
 * Class for creating a custom form
 */
declare class Form {
    crsf: Readonly<{
        value: string;
        type: "hidden";
    }>;
    /**
     * Error message when value is not a number
     */
    get name(): string;
    static errors: {
        number: string;
        email: string;
        url: string;
        checkbox: string;
        required: string;
        maxLength: string;
        min: string;
        max: string;
    };
    /**
     * @returns an iterable of fields to display on the frontend
     */
    get fields(): Field[];
    /**
     * @param formData to first validate then parse to the appropiate type for backend logic
     * @returns whether the form was valid, a message if the form was invalid, and the data if the form was valid
     */
    consume(formData: FormData): {
        secure: boolean;
        valid: boolean;
        values: Array<any>;
        errors: Array<string>;
    };
}

export { CheckboxField, EmailField, Field, FieldError, Form, NumberField, PasswordField, TextAreaField, TextField, UrlField };
