import { z, ZodError } from "zod";

type FieldDefinition = Record<
  string,
  {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    validation: z.ZodType<any, any, any>;
  }
>;

// Define a utility type for the form values
type FormValues<T extends FieldDefinition> = {
  [K in keyof T]: T[K]["validation"] extends z.ZodType<infer U, any, any>
    ? U
    : string;
};

type ValidationResult<T extends FieldDefinition> =
  | {
      success: true;
      data: FormValues<T>;
    }
  | {
      success: false;
      error: string;
    };

export const form = {
  create<T extends FieldDefinition>(formName: string, fields: T) {
    const plugins: Array<(data: FormValues<T>) => Promise<void>> = [];
    let validatedData: FormValues<T>;

    return Object.seal({
      name: formName,
      fields: Object.entries(fields).map(([fieldName, fieldConfig]) => {
        if (!fieldConfig.name) {
          return {
            ...fieldConfig,
            name: fieldName,
          };
        } else {
          return fieldConfig;
        }
      }),
      validate: async (formData: FormData): Promise<ValidationResult<T>> => {
        try {
          validatedData = Object.fromEntries(
            await Promise.all(
              Object.entries(fields).map(async ([fieldName, fieldConfig]) => {
                const value = formData.get(fieldName);

                if (fieldConfig.validation) {
                  const validatedValue =
                    await fieldConfig.validation.parseAsync(value);
                  return [fieldName, validatedValue];
                }

                return [fieldName, value];
              })
            )
          ) as FormValues<T>;
          return { success: true, data: validatedData! };
        } catch (error) {
          return { success: false, error: (error as ZodError).message };
        }
      },
      plugins: {
        add: (plugin: (data: FormValues<T>) => Promise<void>) => {
          plugins.push(plugin);
        },
        run: async () => {
          // Check if validatedData is defined before using it
          if (validatedData) {
            await Promise.all(plugins.map((plugin) => plugin(validatedData)));
          }
        },
      },
    });
  },
};
