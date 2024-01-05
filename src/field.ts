import { z } from "zod";
import { validator } from "./validator";

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  validation: z.ZodType<any, any, any>;
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

export const field = {
  /**
   * text input
   */
  text(params: {
    name?: string;
    label: string;
    placeholder: string;
    value?: string;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "text",
    } satisfies Field;
  },
  /**
   * number input
   */
  number(params: {
    name?: string;
    label: string;
    placeholder: string;
    value?: number;
    validation?: z.ZodNumber;
  }) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.coerce.number(),
      type: "number",
    } satisfies Field;
  },
  /**
   * textarea input
   */
  textArea(params: {
    name?: string;
    label: string;
    placeholder: string;
    value?: string;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "textarea",
    } satisfies Field;
  },
  /**
   * email input
   */
  email(params: {
    name?: string;
    label: string;
    placeholder: string;
    value?: string;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "email",
    } satisfies Field;
  },
  /**
   * password input
   */
  password(params: {
    name?: string;
    label: string;
    placeholder: string;
    value?: string;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "password",
    } satisfies Field;
  },
  /**
   * telephone input
   */
  telephone(params: {
    name?: string;
    label: string;
    placeholder: string;
    value?: number;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      name: params.name || "",
      validation:
        params.validation ||
        validator.string().refine((data) => /^\d{3}-\d{3}-\d{4}$/.test(data), {
          message: "Invalid phone number format.",
        }),
      type: "tel",
    } satisfies Field;
  },
};
