import { z } from "zod";
import { BaseFieldParams, Field } from "./types";

const DEFAULT_VALIDATION = z.string();

export const field = {
  create<T>(
    type: string,
    params: BaseFieldParams<T>,
    defaultValidation?: z.ZodType<T, any, any>
  ): Field<T> {
    let validation: z.ZodType<T, any, any> =
      params.validation || defaultValidation || DEFAULT_VALIDATION;

    if (params.required) {
      // Assuming validation is a ZodString, use .min(1)
      validation = validation.refine(
        (data) =>
          (data as string) !== "" && data !== undefined && data !== null,
        {
          message: "Field is required.",
        }
      );
    }

    return Object.seal({
      ...params,
      name: params.name || "",
      validation,
      type,
    });
  },
  text(params: BaseFieldParams<string>) {
    return this.create("text", params);
  },
  number(params: BaseFieldParams<number>) {
    return this.create("number", params, z.coerce.number());
  },

  textArea(params: BaseFieldParams<string>) {
    return this.create("textarea", params);
  },

  email(params: BaseFieldParams<string>) {
    return this.create("email", params, z.string().email());
  },

  password(params: BaseFieldParams<string>) {
    return this.create("password", params);
  },

  telephone(params: BaseFieldParams<string>) {
    return this.create(
      "tel",
      params,
      z.string().refine((value) => /^\d{3}-\d{3}-\d{4}$/.test(value), {
        message: "Invalid telephone number format.",
      })
    );
  },
};
