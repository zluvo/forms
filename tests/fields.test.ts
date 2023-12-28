const { NumberField, TextField, CheckboxField, Form } = require("../dist");

// TextField tests
test("TextField required validates", () => {
  const textField = new TextField({
    label: "Name",
    placeholder: "Name",
    required: true,
  });
  textField.value = "";
  expect(() => textField.validate()).toThrow(Form.errors.required);
  textField.value = null;
  expect(() => textField.validate()).toThrow(Form.errors.required);
  textField.value = undefined;
  expect(() => textField.validate()).toThrow(Form.errors.required);
});

test(`TextField promotes ${undefined} to ${null}`, () => {
  const textField = new TextField({
    label: "Name",
    placeholder: "Name",
    required: true,
  });
  textField.cast();
  expect(textField.value).toBe(null);
});

test("NumberField required validates", () => {
  const numberField = new NumberField({
    label: "Age",
    placeholder: "Age",
    required: true,
  });
  numberField.value = undefined;
  expect(() => numberField.validate()).toThrow(Form.errors.required);
  numberField.value = null;
  expect(() => numberField.validate()).toThrow(Form.errors.required);
});

test("NumberField type validates", () => {
  const numberField = new NumberField({
    label: "Age",
    placeholder: "Age",
    required: true,
  });
  numberField.value = "asdf";
  expect(() => numberField.validate()).toThrow(Form.errors.required);
});

test("NumberField min validates", () => {
  const numberField = new NumberField({
    label: "Age",
    placeholder: "Age",
    min: 2,
  });
  numberField.value = 1;
  expect(() => numberField.validate()).toThrow(Form.errors.min);
});

test("NumberField max validates", () => {
  const numberField = new NumberField({
    label: "Age",
    placeholder: "Age",
    max: 2,
  });
  numberField.value = 3;
  expect(() => numberField.validate()).toThrow(Form.errors.max);
});

test(`NumberField promotes ${undefined} to ${null}`, () => {
  const numberField = new NumberField({
    label: "Age",
    placeholder: "Age",
  });
  numberField.cast();
  expect(numberField.value).toBe(null);
});

test("CheckboxField required validates", () => {
  const checkboxField = new CheckboxField({
    label: "Enable",
    placeholder: "Enable",
    required: true,
  });
  checkboxField.value = null;
  expect(() => checkboxField.validate()).toThrow(Form.errors.required);
  checkboxField.value = undefined;
  expect(() => checkboxField.validate()).toThrow(Form.errors.required);
});

test("CheckboxField type validates", () => {
  const checkboxField = new CheckboxField({
    label: "Enable",
    placeholder: "Enable",
    required: true,
  });
  checkboxField.value = "asdf";
  expect(() => checkboxField.validate()).toThrow(Form.errors.required);
});

test(`CheckboxField promotes ${undefined} to ${null}`, () => {
  const checkboxField = new CheckboxField({
    label: "Enable",
    placeholder: "Enable",
  });
  checkboxField.cast();
  expect(checkboxField.value).toBe(null);
});
