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
  label: string;
  type: string;
  placeholder: string;
  value?: unknown;

  // input attributes
  maxlength?: number;
  min?: number;
  max?: number;
  required?: boolean;

  error?: string;

  constructor(
    label: string,
    type: string,
    placeholder: string,

    maxlength?: number,
    min?: number,
    max?: number,
    required?: boolean,

    error?: string
  ) {
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;

    this.maxlength = maxlength;
    this.min = min;
    this.max = max;
    this.required = required;

    this.error = error;
  }

  abstract cast(): void;

  abstract validate(): void;
}

/**
 * Field for text based inputs
 */
export class TextField extends Field {
  declare value?: string | null;

  constructor(params: {
    value?: string;
    label: string;
    placeholder: string;

    maxlength?: number;
    required?: boolean;

    error?: string;
  }) {
    super(
      params.label,
      types.text,
      params.placeholder,

      params.maxlength,
      undefined,
      undefined,
      params.required,

      params.error
    );
    this.value = params.value;
  }

  cast() {
    if (this.value === undefined) {
      this.value = null;
    }
  }

  validate(): void {
    this.cast();

    if (this.required && (!this.value || this.value === "")) {
      throw new FieldError(this.error || Form.errors.required);
    }
    this.value = this.value as string;
    if (this.maxlength && this.value.length > this.maxlength) {
      throw new FieldError(this.error || Form.errors.maxLength);
    }
  }
}

/**
 * Field for number based inputs
 */
export class NumberField extends Field {
  declare value?: number | null;

  constructor(params: {
    value?: number;
    label: string;
    placeholder: string;

    min?: number;
    max?: number;
    required?: boolean;

    error?: string;
  }) {
    super(
      params.label,
      types.number,
      params.placeholder,

      undefined,
      params.min,
      params.max,
      params.required,

      params.error
    );
    this.value = params.value;
  }

  cast(): void {
    if (this.value === undefined) {
      this.value = null;
    } else {
      this.value = Number(this.value);
    }
  }

  validate(): void {
    this.cast();

    if (this.required && !this.value) {
      throw new FieldError(this.error || Form.errors.required);
    }
    this.value = this.value as number;
    if (this.min !== undefined && this.value < this.min) {
      throw new FieldError(this.error || Form.errors.min);
    } else if (this.max !== undefined && this.value > this.max) {
      throw new FieldError(this.error || Form.errors.max);
    }
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

  validate(): void {
    super.validate();
    this.value = this.value as string;

    if (
      !this.value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      throw new FieldError(this.error || Form.errors.email);
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

  validate(): void {
    super.validate();
    this.value = this.value as string;

    if (
      !this.value.match(
        /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
      )
    ) {
      throw new FieldError(this.error || Form.errors.url);
    }
  }
}

/**
 * Field for checkbox based inputs
 */
export class CheckboxField extends Field {
  declare value?: "true" | "false" | boolean | null;

  constructor(params: {
    value?: boolean;
    label: string;
    placeholder: string;

    required?: boolean;

    error?: string;
  }) {
    super(
      params.label,
      types.checkbox,
      params.placeholder,

      undefined,
      undefined,
      undefined,
      params.required,

      params.error
    );
    this.value = params.value;
  }

  cast(): void {
    if (this.value === undefined) {
      this.value = null;
    } else {
      this.value = this.value === "true" ? true : false;
    }
  }

  validate(): void {
    this.cast();
    if (this.required && !this.value) {
      throw new FieldError(this.error || Form.errors.required);
    }
  }
}
