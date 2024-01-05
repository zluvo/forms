"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  field: () => field,
  form: () => form,
  validator: () => validator
});
module.exports = __toCommonJS(src_exports);

// src/validator.ts
var import_zod = require("zod");
var validator = import_zod.z;

// src/field.ts
var field = {
  /**
   * text input
   */
  text(params) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "text"
    };
  },
  /**
   * number input
   */
  number(params) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.coerce.number(),
      type: "number"
    };
  },
  /**
   * textarea input
   */
  textArea(params) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "textarea"
    };
  },
  /**
   * email input
   */
  email(params) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "email"
    };
  },
  /**
   * password input
   */
  password(params) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string(),
      type: "password"
    };
  },
  /**
   * telephone input
   */
  telephone(params) {
    return {
      ...params,
      name: params.name || "",
      validation: params.validation || validator.string().refine((data) => /^\d{3}-\d{3}-\d{4}$/.test(data), {
        message: "Invalid phone number format."
      }),
      type: "tel"
    };
  }
};

// src/form.ts
var form = {
  create(formName, fields, options = {}) {
    const plugins = [];
    let validatedData;
    return {
      name: formName,
      fields: Object.entries(fields).map(([fieldName, fieldConfig]) => {
        if (!fieldConfig.name) {
          return {
            ...fieldConfig,
            name: fieldName
          };
        } else {
          return fieldConfig;
        }
      }),
      validate: async (formData) => {
        try {
          validatedData = Object.fromEntries(
            await Promise.all(
              Object.entries(fields).map(async ([fieldName, fieldConfig]) => {
                const value = formData.get(fieldName);
                if (fieldConfig.validation) {
                  const validatedValue = await fieldConfig.validation.parseAsync(value);
                  return [fieldName, validatedValue];
                }
                return [fieldName, value];
              })
            )
          );
          return { success: true, data: validatedData };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      plugins: {
        add: (plugin) => {
          plugins.push(plugin);
        },
        run: async () => {
          await Promise.all(plugins.map((plugin) => plugin(validatedData)));
        }
      }
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  field,
  form,
  validator
});
