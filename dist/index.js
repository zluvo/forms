"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Form: () => Form,
  field: () => field,
  validator: () => validator
});
module.exports = __toCommonJS(src_exports);

// src/validator.ts
var import_zod = require("zod");
var validator = import_zod.z;

// src/field.ts
var field = class {
  /**
   * text input
   */
  static text(params) {
    return { ...params, defaultValidation: validator.string(), type: "text" };
  }
  /**
   * number input
   */
  static number(params) {
    return {
      ...params,
      defaultValidation: validator.coerce.number(),
      type: "number"
    };
  }
  /**
   * textarea input
   */
  static textArea(params) {
    return {
      ...params,
      defaultValidation: validator.string(),
      type: "textarea"
    };
  }
  /**
   * email input
   */
  static email(params) {
    return {
      ...params,
      defaultValidation: validator.string().email(),
      type: "email"
    };
  }
  /**
   * password input
   */
  static password(params) {
    return {
      ...params,
      defaultValidation: validator.string(),
      type: "password"
    };
  }
  /**
   * telephone input
   */
  static telephone(params) {
    return {
      ...params,
      defaultValidation: validator.string().refine((data) => /^\d{3}-\d{3}-\d{4}$/.test(data), {
        message: "Invalid phone number format."
      }),
      type: "tel"
    };
  }
};

// src/security.ts
var import_crypto = __toESM(require("crypto"));
var security = class {
  static hash(payload) {
    return import_crypto.default.createHmac("sha256", `secret:${process.env.ZLUVO_CSRF || ""}`).update(payload).digest("hex");
  }
  static generate() {
    const payload = import_crypto.default.randomBytes(10).toString("hex");
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
  _fields = [];
  _crsfOn = false;
  constructor(args) {
    if (args?.crsf)
      this._crsfOn = true;
  }
  /**
   * returns a generated crsf token to ensure secure submissions
   */
  get crsf() {
    if (!this._crsfOn)
      throw new Error("crsf is not configured for this form");
    return {
      value: security.generate(),
      type: "hidden"
    };
  }
  /**
   * returns every field for this form to be embedded into your UI
   */
  get fields() {
    if (!this._fields.length) {
      this._fields = Object.values(this).slice(2);
      const names = Object.keys(this).slice(2);
      this._fields.forEach((field2, i) => {
        field2.name = names[i];
      });
    }
    return this._fields;
  }
  set fields(value) {
    this._fields = value;
  }
  /**
   * creates an instance of a class
   * @param fields
   * @returns
   */
  static create(fields) {
    const temp = new Form();
    temp.fields = Object.values(fields);
    const names = Object.keys(fields);
    temp.fields.forEach((field2, i) => {
      field2.name = names[i];
    });
    return Object.seal(temp);
  }
  /**
   * called within process() to handle any backend logic
   * @param args
   */
  handleSubmission(args) {
  }
  /**
   * process a form given FormData object
   * @param formData
   * @param args
   * @returns
   */
  async process(formData, args) {
    const values = [];
    const errors = [];
    const token = formData.get("crsf");
    if (this._crsfOn && !token) {
      throw new Error("crsf token is not being passed to the form");
    }
    const secure = security.valid(token);
    if (!secure) {
      errors.push("Invalid crsf token");
    }
    await Promise.all(
      this.fields.map(async (field2, i) => {
        const value = formData.get(field2.name) || field2.value;
        const result = await field2.defaultValidation.safeParseAsync(value);
        const fieldErrors = /* @__PURE__ */ new Set();
        if (result.success) {
          field2.value = result.data;
        } else {
          const error = result.error;
          error.issues.map((issue) => issue.message).forEach((error2) => fieldErrors.add(error2));
        }
        if (field2.validation) {
          const result2 = await field2.validation.safeParseAsync(value);
          if (result2.success) {
            field2.value = result2.data;
          } else {
            const error = result2.error;
            error.issues.map((issue) => issue.message).forEach((error2) => fieldErrors.add(error2));
          }
        }
        if (fieldErrors.size) {
          errors.push(...fieldErrors);
        } else {
          values.push(field2.value);
        }
      })
    );
    const valid = errors.length === 0;
    if (args && valid) {
      this.handleSubmission(args);
    }
    return {
      secure,
      valid,
      errors,
      values: valid ? values : []
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Form,
  field,
  validator
});
