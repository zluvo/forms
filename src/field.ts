import { z } from "zod";
import { validator } from "./validator";

export type Field = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  value: number | string | boolean;
  defaultValidation:
    | z.ZodString
    | z.ZodNumber
    | z.ZodEffects<z.ZodString | z.ZodNumber>;
  validation?: z.ZodAny;
};

export class field {
  /**
   * text input
   */
  static text(params: {
    label: string;
    placeholder: string;
    value: string;
    validation?: z.ZodString;
  }) {
    return { ...params, defaultValidation: validator.string(), type: "text" };
  }

  /**
   * number input
   */
  static number(params: {
    label: string;
    placeholder: string;
    value: number;
    validation?: z.ZodNumber;
  }) {
    return {
      ...params,
      defaultValidation: validator.coerce.number(),
      type: "number",
    };
  }

  /**
   * textarea input
   */
  static textArea(params: {
    label: string;
    placeholder: string;
    value: number;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      defaultValidation: validator.string(),
      type: "textarea",
    };
  }

  /**
   * email input
   */
  static email(params: {
    label: string;
    placeholder: string;
    value: number;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      defaultValidation: validator.string().email(),
      type: "email",
    };
  }

  /**
   * password input
   */
  static password(params: {
    label: string;
    placeholder: string;
    value: number;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      defaultValidation: validator.string(),
      type: "password",
    };
  }

  /**
   * telephone input
   */
  static telephone(params: {
    label: string;
    placeholder: string;
    value: number;
    validation?: z.ZodString;
  }) {
    return {
      ...params,
      defaultValidation: validator
        .string()
        .refine((data) => /^\d{3}-\d{3}-\d{4}$/.test(data), {
          message: "Invalid phone number format.",
        }),
      type: "tel",
    };
  }
}
