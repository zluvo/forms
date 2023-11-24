import { Field, FieldError } from "./fields";

/**
 * Class for creating a custom form
 */
export class Form {
  /**
   * Error message when value is not a number
   */
  static errorMessages = {
    number: "Value is not a valid number",
    email: "Value is not a valid email address",
    url: "Value is not valid url",
    checkbox: "Value is not true or false",

    required: "Field is required",
    maxLength: "Value exceeds max length",
    min: "Value is smaller than minimum value",
    max: "Value is bigger than maximum value",
  };

  static settings: {
    strict: boolean;
    record: boolean;
  } = {
    strict: false,
    record: false,
  };

  /**
   * @returns an iterable of fields to display on the frontend
   */
  static fields(): Field[] {
    const names: Array<string> = Object.keys(this);
    const fields: Array<Field> = Object.values(this);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const field = fields[i];

      if (name && field) {
        field.name = name;
        fields[i] = field;
      }
    }

    return fields;
  }

  /**
   * @param formData to first validate then parse to the appropiate type for backend logic
   * @returns whether the form was valid, a message if the form was invalid, and the data if the form was valid
   */
  static consume<Type>(formData: FormData): {
    data?: Type;
    errorMessage?: string;
  } {
    const names: Array<string> = Object.keys(this);
    const fields: Array<Field> = Object.values(this);
    const data: Record<string, any> = {};

    for (let i = 0; i < fields.length; i++) {
      const name = names[i];
      const field = fields[i];

      if (name && field) {
        try {
          const value = formData.get(name);
          field.validate(value as string);
          data[name] = field.cast(value as string);
          field.value = field.cast(value as string);
        } catch (e: unknown) {
          const fieldError = e as FieldError;
          return {
            errorMessage: fieldError.message,
          };
        }
      }
    }

    return {
      data: data as Type,
    };
  }
}
