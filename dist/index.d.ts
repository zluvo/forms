import { z } from 'zod';

type Field = {
    label: string;
    placeholder: string;
    type: string;
    value: number | string | boolean;
    defaultValidation: z.ZodString | z.ZodNumber | z.ZodEffects<z.ZodString | z.ZodNumber>;
    validation?: z.ZodAny;
};
declare class field {
    /**
     * text input
     */
    static text(params: {
        label: string;
        placeholder: string;
        value: string;
        validation?: z.ZodString;
    }): {
        defaultValidation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value: string;
        validation?: z.ZodString | undefined;
    };
    /**
     * number input
     */
    static number(params: {
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodNumber;
    }): {
        defaultValidation: z.ZodNumber;
        type: string;
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodNumber | undefined;
    };
    /**
     * textarea input
     */
    static textArea(params: {
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString;
    }): {
        defaultValidation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString | undefined;
    };
    /**
     * email input
     */
    static email(params: {
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString;
    }): {
        defaultValidation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString | undefined;
    };
    /**
     * password input
     */
    static password(params: {
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString;
    }): {
        defaultValidation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString | undefined;
    };
    /**
     * telephone input
     */
    static telephone(params: {
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString;
    }): {
        defaultValidation: z.ZodEffects<z.ZodString, string, string>;
        type: string;
        label: string;
        placeholder: string;
        value: number;
        validation?: z.ZodString | undefined;
    };
}

type Fields = {
    [name: string]: Field;
};
declare class form {
    private _fields;
    private _names;
    private _crsfOn;
    constructor(args?: {
        crsf: boolean;
    });
    /**
     * returns a generated crsf token to ensure secure submissions
     */
    get crsf(): {
        value: string;
        type: string;
    };
    /**
     * names of each field added to the class
     */
    private get names();
    private set names(value);
    /**
     * returns every field for this form to be embedded into your UI
     */
    get fields(): Field[];
    private set fields(value);
    /**
     * creates an instance of a class
     * @param fields
     * @returns
     */
    static create(fields: Fields): form;
    /**
     * called within process() to handle any backend logic
     * @param args
     */
    handleSubmission(args: {
        [name: string]: any;
    }): void;
    /**
     * process a form given FormData object
     * @param formData
     * @param args
     * @returns
     */
    process(formData: FormData, args?: {
        [name: string]: any;
    }): Promise<{
        secure: boolean;
        valid: boolean;
        errors: string[];
        values: (number | boolean | string)[];
    }>;
}

declare const validator: typeof z;

export { Field, Fields, field, form, validator };
