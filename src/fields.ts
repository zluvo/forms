import { Form } from "./form";

const types = Object.freeze({
  text: "text",
  tel: "tel",
  checkbox: "checkbox",
  email: "email",
  password: "password",
  url: "url",
  number: "number",
  textarea: "textarea",
});

export class FieldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export abstract class Field {
  // input metadata
  name?: string;
  label: string;
  type: string;
  placeholder: string;
  value?: any = null;

  // input attributes
  maxlength?: number;
  min?: number;
  max?: number;
  required?: boolean;

  errorMessage?: string;

  constructor(
    label: string,
    type: string,
    placeholder: string,

    maxlength?: number,
    min?: number,
    max?: number,
    required?: boolean,

    errorMessage?: string
  ) {
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;

    this.maxlength = maxlength;
    this.min = min;
    this.max = max;
    this.required = required;

    this.errorMessage = errorMessage;
  }

  validate(value: string): void {
    if (this.required && (value === null || value === "")) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.required
      );
    }
  }

  abstract cast(value?: string): any;
}

/**
 * Field for text based inputs
 */
export class TextField extends Field {
  declare value?: string;

  constructor(params: {
    label: string;
    placeholder: string;

    maxlength?: number;
    required?: boolean;

    errorMessage?: string;
  }) {
    super(
      params.label,
      types.text,
      params.placeholder,

      params.maxlength,
      undefined,
      undefined,
      params.required,

      params.errorMessage
    );
  }

  cast(value?: string): string | null {
    if (value) {
      return value;
    }

    return null;
  }

  validate(value: string): void {
    super.validate(value);

    if (this.maxlength && value.length > this.maxlength) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.maxLength
      );
    }
  }
}

/**
 * Field for number based inputs
 */
export class NumberField extends Field {
  declare value?: number;

  constructor(params: {
    label: string;
    placeholder: string;

    min?: number;
    max?: number;
    required?: boolean;

    errorMessage?: string;
  }) {
    super(
      params.label,
      types.number,
      params.placeholder,

      undefined,
      params.min,
      params.max,
      params.required,

      params.errorMessage
    );
  }

  validate(value: string): void {
    super.validate(value);

    const casted = this.cast(value) as number;
    if (isNaN(casted)) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.number
      );
    } else if (this.min && casted < this.min) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.min
      );
    } else if (this.max && casted > this.max) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.max
      );
    }
  }

  cast(value?: string): number | null {
    if (value) {
      return Number(value);
    }

    return null;
  }
}
/**
 * Field for textarea based inputs
 */
export class TextAreaField extends TextField {
  type = types.textarea;
}

/**
 * Field for email based inputs
 */
export class EmailField extends TextField {
  type = types.email;

  validate(value: string): void {
    super.validate(value);

    if (
      !value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.email
      );
    }
  }
}

/**
 * Field for password based inputs
 */
export class PasswordField extends TextField {
  type = types.password;
}

/**
 * Field for url based inputs
 */
export class UrlField extends TextField {
  type = types.url;

  validate(value: string): void {
    super.validate(value);

    if (
      !value.match(
        /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
      )
    ) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.url
      );
    }
  }
}

/**
 * Field for checkbox based inputs
 */
export class CheckboxField extends Field {
  declare value?: boolean;

  constructor(params: {
    label: string;
    placeholder: string;

    required?: boolean;

    errorMessage?: string;
  }) {
    super(
      params.label,
      types.checkbox,
      params.placeholder,

      undefined,
      undefined,
      undefined,
      params.required,

      params.errorMessage
    );
  }

  validate(value: string): void {
    super.validate(value);

    if (!(value === "true" || value === "false")) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.checkbox
      );
    }
  }

  cast(value?: string): boolean | null {
    if (value) {
      return value === "true" ? true : false;
    }

    return null;
  }
}
