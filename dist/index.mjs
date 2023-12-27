var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/logger.ts
import path from "path";
var Logger = class {
  static record(formName, errors) {
    const config = __require(path.join(process.cwd(), "package.json"));
    console.log({
      time: new Date(),
      project: {
        name: config.name,
        version: config.version
      },
      form: formName,
      errors
    });
    if (process.env.ZLUVO_TOKEN) {
      fetch("http://localhost:3000/api/record", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ZLUVO_TOKEN}`
        },
        body: JSON.stringify({
          time: new Date(),
          project: {
            name: config.name,
            version: config.version
          },
          form: formName,
          errors
        })
      });
    }
  }
};

// src/form.ts
var Form = class {
  get name() {
    return this.constructor.name;
  }
  get fields() {
    return Object.values(this);
  }
  consume(formData, params) {
    const names = Object.keys(this);
    const fields = Object.values(this);
    const errors = [];
    fields.forEach((field, index) => {
      const name = names[index];
      if (name) {
        if (name === "name")
          throw new Error(
            "name is a reserved property. Use _name or something else."
          );
        field.value = formData.get(name) || field.value;
        try {
          field.validate();
        } catch (e) {
          const fieldError = e;
          errors.push(fieldError.message);
        }
      }
    });
    if (errors.length && params?.record) {
      Logger.record(this.name, errors);
    }
    if (errors.length) {
      return {
        valid: false,
        errors,
        values: []
      };
    } else {
      return {
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
    this.value = this.value || null;
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
    this.value = this.value ? Number(this.value) : null;
  }
  validate() {
    this.cast();
    if (this.required && !this.value) {
      throw new FieldError(this.error || Form.errors.number);
    }
    this.value = this.value;
    if (this.min && this.value < this.min) {
      throw new FieldError(this.error || Form.errors.min);
    } else if (this.max && this.value > this.max) {
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
    if (this.value) {
      this.value = this.value === "true" ? true : false;
    }
    this.value = null;
  }
  validate() {
    this.cast();
    if (this.required && !this.value) {
      throw new FieldError(this.error || Form.errors.checkbox);
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
