const { CheckboxField, Form, NumberField, TextField } = require("../dist");
const crypto = require("crypto");

beforeAll(() => {
  process.env = Object.assign(process.env, {
    ZLUVO_CSRF: crypto.randomUUID(),
  });
});

test("Form.fields generates correctly", () => {
  class TestForm extends Form {
    test1 = new TextField({
      label: "test1",
      placeholder: "test1",
    });
    test2 = new NumberField({
      label: "test2",
      placeholder: "test2",
    });
    test3 = new CheckboxField({
      label: "test3",
      placeholder: "test3",
    });
  }
  const testForm = new TestForm();
  expect(testForm.fields).toStrictEqual([
    testForm.crsf,
    testForm.test1,
    testForm.test2,
    testForm.test3,
  ]);
});

test("Form.name returns the correct name", () => {
  class TestForm extends Form {}
  const testForm = new TestForm();
  expect(testForm.name).toBe("TestForm");
});

test("Form.consume() returns secure: false with incorrect crsf", () => {
  class TestForm extends Form {}
  const testForm = new TestForm();
  const formData = new FormData();
  formData.append("crsf", "asdf.asdf");
  expect(testForm.consume(formData).secure).toBe(false);
});

test("Form.consume() returns valid: false and values: [] with invalid field", () => {
  class TestForm extends Form {
    test1 = new TextField({
      label: "test1",
      placeholder: "test1",
      required: true,
    });
  }
  const testForm = new TestForm();
  const formData = new FormData();
  formData.append("crsf", testForm.crsf.value);
  expect(testForm.consume(formData).valid).toBe(false);
  expect(testForm.consume(formData).values).toStrictEqual([]);
});
