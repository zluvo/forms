// src/validator.ts
import { z } from "zod";
var validator = z;

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
import crypto from "crypto";
var security = class {
  static hash(payload) {
    return crypto.createHmac("sha256", `secret:${process.env.ZLUVO_CSRF || ""}`).update(payload).digest("hex");
  }
  static generate() {
    const payload = crypto.randomBytes(10).toString("hex");
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
var form = class {
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
    const temp = new form();
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
export {
  field,
  form,
  validator
};
