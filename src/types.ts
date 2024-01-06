import { z } from "zod";

export type Field<T> = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  validation: z.ZodType<T, any, any>;
};

export type BaseFieldParams<T> = {
  name?: string;
  label: string;
  placeholder: string;
  value?: T;
  validation?: z.ZodType<any, any, any>;
  required?: boolean;
};

export type FieldDefinition = Record<
  string,
  {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    validation: z.ZodType<any, any, any>;
  }
>;

// Define a utility type for the form values
export type FormValues<T extends FieldDefinition> = {
  [K in keyof T]: T[K]["validation"] extends z.ZodType<infer U, any, any>
    ? U
    : string;
};

export type ValidationResult<T extends FieldDefinition> =
  | {
      success: true;
      data: FormValues<T>;
    }
  | {
      success: false;
      error: string;
    };
