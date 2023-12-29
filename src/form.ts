import { Field, FieldError } from "./fields";
// import Logger from "./logger";
import Security from "./security";

/**
 * Class for creating a custom form
 */
export class Form {
  crsf = Object.freeze({
    value: Security.generate(),
    type: "hidden",
  });
  /**
   * Error message when value is not a number
   */
  get name() {
    return this.constructor.name;
  }

  static errors = {
    number: "Value is not a valid number",
    email: "Value is not a valid email address",
    url: "Value is not valid url",
    checkbox: "Value is not true or false",
    required: "Field is required",
    maxLength: "Value exceeds max length",
    min: "Value is smaller than minimum value",
    max: "Value is bigger than maximum value",
  };

  /**
   * @returns an iterable of fields to display on the frontend
   */
  get fields(): Field[] {
    return Object.values(this);
  }

  /**
   * @param formData to first validate then parse to the appropiate type for backend logic
   * @returns whether the form was valid, a message if the form was invalid, and the data if the form was valid
   */
  consume(
    formData: FormData
    // params?: {
    //   record: boolean;
    // }
  ): {
    secure: boolean;
    valid: boolean;
    values: Array<any>;
    errors: Array<string>;
  } {
    const crsf = formData.get("crsf");
    const secure = crsf ? Security.valid(crsf as string) : false;

    const names = Object.keys(this).slice(1);
    const fields = this.fields.slice(1);
    const errors: Array<string> = [];

    fields.forEach((field: Field, index: number) => {
      const name = names[index];
      if (name) {
        // if (name === "name")
        //   throw new Error(
        //     "name is a reserved property. Use _name or something else."
        //   );

        field.value = formData.get(name) || field.value;

        try {
          field.validate();
        } catch (e: unknown) {
          const fieldError: FieldError = e as FieldError;
          errors.push(fieldError.message);
        }
      }
    });

    // if (errors.length && params?.record) {
    //   Logger.record(this.name, errors);
    // }

    if (errors.length) {
      return {
        secure: secure,
        valid: false,
        errors: errors,
        values: [],
      };
    } else {
      return {
        secure: secure,
        valid: true,
        errors: [],
        values: fields.map((field) => field.value),
      };
    }
  }
}
