var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/security.ts
import crypto from "crypto";
var Security = class {
  static hash(payload) {
    if (!process.env.ZLUVO_CSRF) {
      throw new Error("process.env.ZLUVO_CSRF is not defined");
    }
    return crypto.createHmac("sha256", `secret:${process.env.ZLUVO_CSRF}`).update(payload).digest("hex");
  }
  static generate() {
    const payload = Buffer.from(crypto.randomUUID()).toString("base64");
    return `${payload}.${this.hash(payload)}`;
  }
  static valid(value) {
    const keyParts = value.split(".");
    if (keyParts[0] && keyParts[1]) {
      return this.hash(keyParts[0]) === keyParts[1];
    }
    return false;
  }
};

// src/form.ts
var Form = class {
  crsf = Object.freeze({
    value: Security.generate(),
    type: "hidden"
  });
  get name() {
    return this.constructor.name;
  }
  get fields() {
    return Object.values(this);
  }
  consume(formData) {
    const crsf = formData.get("crsf");
    const secure = crsf ? Security.valid(crsf) : false;
    const names = Object.keys(this).slice(1);
    const fields = this.fields.slice(1);
    console.log(fields);
    const errors = [];
    fields.forEach((field, index) => {
      const name = names[index];
      if (name) {
        field.value = formData.get(name) || field.value;
        try {
          field.validate();
        } catch (e) {
          const fieldError = e;
          errors.push(fieldError.message);
        }
      }
    });
    if (errors.length) {
      return {
        secure,
        valid: false,
        errors,
        values: []
      };
    } else {
      return {
        secure,
        valid: true,
        errors: [],
        values: fields.map((field) => field.value)
      };
    }
  }
};
__publicField(Form, "errors", {
  number: "Value is not a valid number",
  email: "Value is not a valid email address",
  url: "Value is not valid url",
  checkbox: "Value is not true or false",
  required: "Field is required",
  maxLength: "Value exceeds max length",
  min: "Value is smaller than minimum value",
  max: "Value is bigger than maximum value"
});

// src/fields.ts
var types = Object.freeze({
  text: "text",
  tel: "tel",
  checkbox: "checkbox",
  email: "email",
  password: "password",
  url: "url",
  number: "number",
  textarea: "textarea"
});
var FieldError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
};
var Field = class {
  label;
  type;
  placeholder;
  value;
  maxlength;
  min;
  max;
  required;
  error;
  constructor(label, type, placeholder, maxlength, min, max, required, error) {
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.maxlength = maxlength;
    this.min = min;
    this.max = max;
    this.required = required;
    this.error = error;
  }
};
var TextField = class extends Field {
  constructor(params) {
    super(
      params.label,
      types.text,
      params.placeholder,
      params.maxlength,
      void 0,
      void 0,
      params.required,
      params.error
    );
    this.value = params.value;
  }
  cast() {
    if (this.value === void 0) {
      this.value = null;
    }
  }
  validate() {
    this.cast();
    if (this.required && (!this.value || this.value === "")) {
      throw new FieldError(this.error || Form.errors.required);
    }
    this.value = this.value;
    if (this.maxlength && this.value.length > this.maxlength) {
      throw new FieldError(this.error || Form.errors.maxLength);
    }
  }
};
var NumberField = class extends Field {
  constructor(params) {
    super(
      params.label,
      types.number,
      params.placeholder,
      void 0,
      params.min,
      params.max,
      params.required,
      params.error
    );
    this.value = params.value;
  }
  cast() {
    if (this.value === void 0) {
      this.value = null;
    } else {
      this.value = Number(this.value);
    }
  }
  validate() {
    this.cast();
    if (this.required && !this.value) {
      throw new FieldError(this.error || Form.errors.required);
    }
    this.value = this.value;
    if (this.min !== void 0 && this.value < this.min) {
      throw new FieldError(this.error || Form.errors.min);
    } else if (this.max !== void 0 && this.value > this.max) {
      throw new FieldError(this.error || Form.errors.max);
    }
  }
};
var TextAreaField = class extends TextField {
  type = types.textarea;
};
var EmailField = class extends TextField {
  type = types.email;
  validate() {
    super.validate();
    this.value = this.value;
    if (!this.value.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      throw new FieldError(this.error || Form.errors.email);
    }
  }
};
var PasswordField = class extends TextField {
  type = types.password;
};
var UrlField = class extends TextField {
  type = types.url;
  validate() {
    super.validate();
    this.value = this.value;
    if (!this.value.match(
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
    )) {
      throw new FieldError(this.error || Form.errors.url);
    }
  }
};
var CheckboxField = class extends Field {
  constructor(params) {
    super(
      params.label,
      types.checkbox,
      params.placeholder,
      void 0,
      void 0,
      void 0,
      params.required,
      params.error
    );
    this.value = params.value;
  }
  cast() {
    if (this.value === void 0) {
      this.value = null;
    } else {
      this.value = this.value === "true" ? true : false;
    }
  }
  validate() {
    this.cast();
    if (this.required && !this.value) {
      throw new FieldError(this.error || Form.errors.required);
    }
  }
};
export {
  CheckboxField,
  EmailField,
  Field,
  FieldError,
  Form,
  NumberField,
  PasswordField,
  TextAreaField,
  TextField,
  UrlField
};
