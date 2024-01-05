import { z } from 'zod';

type FieldDefinition = Record<string, {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    validation: z.ZodType<any, any, any>;
}>;
declare const field: {
    /**
     * text input
     */
    text(params: {
        name?: string;
        label: string;
        placeholder: string;
        value?: string;
        validation?: z.ZodString;
    }): {
        name: string;
        validation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value?: string | undefined;
    };
    /**
     * number input
     */
    number(params: {
        name?: string;
        label: string;
        placeholder: string;
        value?: number;
        validation?: z.ZodNumber;
    }): {
        name: string;
        validation: z.ZodNumber;
        type: string;
        label: string;
        placeholder: string;
        value?: number | undefined;
    };
    /**
     * textarea input
     */
    textArea(params: {
        name?: string;
        label: string;
        placeholder: string;
        value?: string;
        validation?: z.ZodString;
    }): {
        name: string;
        validation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value?: string | undefined;
    };
    /**
     * email input
     */
    email(params: {
        name?: string;
        label: string;
        placeholder: string;
        value?: string;
        validation?: z.ZodString;
    }): {
        name: string;
        validation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value?: string | undefined;
    };
    /**
     * password input
     */
    password(params: {
        name?: string;
        label: string;
        placeholder: string;
        value?: string;
        validation?: z.ZodString;
    }): {
        name: string;
        validation: z.ZodString;
        type: string;
        label: string;
        placeholder: string;
        value?: string | undefined;
    };
    /**
     * telephone input
     */
    telephone(params: {
        name?: string;
        label: string;
        placeholder: string;
        value?: number;
        validation?: z.ZodString;
    }): {
        name: string;
        validation: z.ZodString | z.ZodEffects<z.ZodString, string, string>;
        type: string;
        label: string;
        placeholder: string;
        value?: number | undefined;
    };
};

type FormValues<T extends FieldDefinition> = {
    [K in keyof T]: T[K]["validation"] extends z.ZodType<infer U, any, any> ? U : T[K]["type"] extends "number" ? number : string;
};
type ValidationResult<T extends FieldDefinition> = {
    success: true;
    data: FormValues<T>;
} | {
    success: false;
    error: string;
};
type FormCreateOptions = {
    plugins?: Array<() => void>;
};
declare const form: {
    create<T extends FieldDefinition>(formName: string, fields: T, options?: FormCreateOptions): {
        name: string;
        fields: {
            name: string;
            label: string;
            placeholder: string;
            type: string;
            validation: z.ZodType<any, any, any>;
        }[];
        validate: (formData: FormData) => Promise<ValidationResult<T>>;
        plugins: {
            add: (plugin: (data: FormValues<T>) => Promise<void>) => void;
            run: () => Promise<void>;
        };
    };
};

declare const validator: typeof z;

export { FieldDefinition, field, form, validator };
