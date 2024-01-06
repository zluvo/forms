import { z } from 'zod';

type Field<T> = {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    validation: z.ZodType<T, any, any>;
};
type BaseFieldParams<T> = {
    name?: string;
    label: string;
    placeholder: string;
    value?: T;
    validation?: z.ZodType<any, any, any>;
    required?: boolean;
};
declare const field: {
    create<T>(type: string, params: BaseFieldParams<T>, defaultValidation?: z.ZodType<T, any, any> | undefined): Field<T>;
    text(params: BaseFieldParams<string>): Field<string>;
    number(params: BaseFieldParams<number>): Field<number>;
    textArea(params: BaseFieldParams<string>): Field<string>;
    email(params: BaseFieldParams<string>): Field<string>;
    password(params: BaseFieldParams<string>): Field<string>;
    telephone(params: BaseFieldParams<string>): Field<string>;
};

type FieldDefinition = Record<string, {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    validation: z.ZodType<any, any, any>;
}>;
type FormValues<T extends FieldDefinition> = {
    [K in keyof T]: T[K]["validation"] extends z.ZodType<infer U, any, any> ? U : string;
};
type ValidationResult<T extends FieldDefinition> = {
    success: true;
    data: FormValues<T>;
} | {
    success: false;
    error: string;
};
declare const form: {
    create<T extends FieldDefinition>(formName: string, fields: T): {
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

export { field, form, validator };
