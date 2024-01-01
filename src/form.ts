import { z } from "zod";
import type { Field } from "./field";
import security from "./security";

export type Fields = {
  [name: string]: Field;
};

export class form {
  private _fields: Field[] = [];
  private _names: string[] = [];
  private _crsfOn: Boolean = false;

  constructor(args?: { crsf: boolean }) {
    if (args?.crsf) this._crsfOn = true;
  }

  /**
   * returns a generated crsf token to ensure secure submissions
   */
  get crsf() {
    if (!this._crsfOn) throw new Error("crsf is not configured for this form");

    return {
      value: security.generate(),
      type: "hidden",
    };
  }

  /**
   * names of each field added to the class
   */
  private get names() {
    if (!this._names.length) {
      this._names = Object.keys(this).slice(3);
    }
    return this._names;
  }
  private set names(value: string[]) {
    this._names = value;
  }

  /**
   * returns every field for this form to be embedded into your UI
   */
  get fields() {
    if (!this._fields.length) {
      this._fields = Object.values(this).slice(3);
    }
    return this._fields;
  }
  private set fields(value: Field[]) {
    this._fields = value;
  }

  /**
   * creates an instance of a class
   * @param fields
   * @returns
   */
  static create(fields: Fields) {
    const temp = new form();
    temp.fields = Object.values(fields);
    temp.names = Object.keys(fields);
    return Object.seal(temp);
  }

  /**
   * called within process() to handle any backend logic
   * @param args
   */
  handleSubmission(args: { [name: string]: any }) {}

  /**
   * process a form given FormData object
   * @param formData
   * @param args
   * @returns
   */
  async process(
    formData: FormData,
    args?: { [name: string]: any }
  ): Promise<{
    secure: boolean;
    valid: boolean;
    errors: string[];
    values: (number | boolean | string)[];
  }> {
    const values: (number | boolean | string)[] = [];
    const errors: string[] = [];

    const token = formData.get("crsf");

    if (this._crsfOn && !token) {
      throw new Error("crsf token is not being passed to the form");
    }

    const secure: boolean = security.valid(token as string);
    if (!secure) {
      errors.push("Invalid crsf token");
    }

    // Use Promise.all to parallelize field processing
    await Promise.all(
      this.fields.map(async (field: Field, i: number) => {
        const name = this.names[i];
        if (name) {
          const value = formData.get(name) || field.value;
          const result = await field.defaultValidation.safeParseAsync(value);
          const fieldErrors = new Set<string>();

          // default validation
          if (result.success) {
            field.value = result.data;
          } else {
            const error: z.ZodError = result.error;
            error.issues
              .map((issue) => issue.message)
              .forEach((error) => fieldErrors.add(error));
          }

          // extra validation
          if (field.validation) {
            const result = await field.validation.safeParseAsync(value);
            if (result.success) {
              field.value = result.data;
            } else {
              const error: z.ZodError = result.error;
              error.issues
                .map((issue) => issue.message)
                .forEach((error) => fieldErrors.add(error));
            }
          }

          if (fieldErrors.size) {
            errors.push(...fieldErrors);
          } else {
            values.push(field.value);
          }
        }
      })
    );

    const valid = errors.length === 0;

    if (args && valid) {
      this.handleSubmission(args);
    }

    return {
      secure: secure,
      valid: valid,
      errors: errors,
      values: valid ? values : [],
    };
  }
}
