"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CheckboxField: () => CheckboxField,
  EmailField: () => EmailField,
  Field: () => Field,
  FieldError: () => FieldError,
  Form: () => Form,
  NumberField: () => NumberField,
  PasswordField: () => PasswordField,
  TextAreaField: () => TextAreaField,
  TextField: () => TextField,
  UrlField: () => UrlField
});
module.exports = __toCommonJS(src_exports);

// src/form.ts
var Form = class {
  static fields() {
    const names = Object.keys(this);
    const fields = Object.values(this);
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
  static consume(formData) {
    const names = Object.keys(this);
    const fields = Object.values(this);
    const data = {};
    for (let i = 0; i < fields.length; i++) {
      const name = names[i];
      const field = fields[i];
      if (name && field) {
        try {
          const value = formData.get(name);
          field.validate(value);
          data[name] = field.cast(value);
          field.value = field.cast(value);
        } catch (e) {
          const fieldError = e;
          return {
            errorMessage: fieldError.message
          };
        }
      }
    }
    return {
      data
    };
  }
};
__publicField(Form, "errorMessages", {
  number: "Value is not a valid number",
  email: "Value is not a valid email address",
  url: "Value is not valid url",
  checkbox: "Value is not true or false",
  required: "Field is required",
  maxLength: "Value exceeds max length",
  min: "Value is smaller than minimum value",
  max: "Value is bigger than maximum value"
});
__publicField(Form, "settings", {
  strict: false,
  record: false
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
  name;
  label;
  type;
  placeholder;
  value = null;
  maxlength;
  min;
  max;
  required;
  errorMessage;
  constructor(label, type, placeholder, maxlength, min, max, required, errorMessage) {
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.maxlength = maxlength;
    this.min = min;
    this.max = max;
    this.required = required;
    this.errorMessage = errorMessage;
  }
  validate(value) {
    if (this.required && (value === null || value === "")) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.required
      );
    }
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
      params.errorMessage
    );
  }
  cast(value) {
    if (value) {
      return value;
    }
    return null;
  }
  validate(value) {
    super.validate(value);
    if (this.maxlength && value.length > this.maxlength) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.maxLength
      );
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
      params.errorMessage
    );
  }
  validate(value) {
    super.validate(value);
    const casted = this.cast(value);
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
  cast(value) {
    if (value) {
      return Number(value);
    }
    return null;
  }
};
var TextAreaField = class extends TextField {
  type = types.textarea;
};
var EmailField = class extends TextField {
  type = types.email;
  validate(value) {
    super.validate(value);
    if (!value.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.email
      );
    }
  }
};
var PasswordField = class extends TextField {
  type = types.password;
};
var UrlField = class extends TextField {
  type = types.url;
  validate(value) {
    super.validate(value);
    if (!value.match(
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
    )) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.url
      );
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
      params.errorMessage
    );
  }
  validate(value) {
    super.validate(value);
    if (!(value === "true" || value === "false")) {
      throw new FieldError(
        this.errorMessage ? this.errorMessage : Form.errorMessages.checkbox
      );
    }
  }
  cast(value) {
    if (value) {
      return value === "true" ? true : false;
    }
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
