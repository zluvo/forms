// src/validator.ts
import { z } from "zod";
var validator = z;

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
export {
  field,
  form,
  validator
};
