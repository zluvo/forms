// src/validator.ts
import { z } from "zod";
var validator = z;

// src/field.ts
var DEFAULT_VALIDATION = validator.string();
var field = {
  create(type, params, defaultValidation) {
    let validation = params.validation || defaultValidation || DEFAULT_VALIDATION;
    if (params.required) {
      validation = validation.refine(
        (data) => data !== "" && data !== void 0 && data !== null,
        {
          message: "Field is required."
        }
      );
    }
    return {
      ...params,
      name: params.name || "",
      validation,
      type
    };
  },
  text(params) {
    return this.create("text", params);
  },
  number(params) {
    return this.create("number", params, validator.coerce.number());
  },
  textArea(params) {
    return this.create("textarea", params);
  },
  email(params) {
    return this.create("email", params, validator.string().email());
  },
  password(params) {
    return this.create("password", params);
  },
  telephone(params) {
    return this.create(
      "tel",
      params,
      validator.string().refine((value) => /^\d{3}-\d{3}-\d{4}$/.test(value), {
        message: "Invalid telephone number format."
      })
    );
  }
};

// src/form.ts
var form = {
  create(formName, fields) {
    const plugins = [];
    let validatedData;
    return Object.seal({
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
          if (validatedData) {
            await Promise.all(plugins.map((plugin) => plugin(validatedData)));
          }
        }
      }
    });
  }
};
export {
  field,
  form,
  validator
};
