const { field } = require("../dist");

test("field.text generates the correct type", () => {
  const result = field.text({
    label: "test",
    placeholder: "test",
  });
  expect(result.type).toStrictEqual("text");
});

test("field.number generates the correct type", () => {
  const result = field.number({
    label: "test",
    placeholder: "test",
  });
  expect(result.type).toStrictEqual("number");
});

test("field.email generates the correct type", () => {
  const result = field.email({
    label: "test",
    placeholder: "test",
  });
  expect(result.type).toStrictEqual("email");
});

test("field.password generates the correct type", () => {
  const result = field.password({
    label: "test",
    placeholder: "test",
  });
  expect(result.type).toStrictEqual("password");
});

test("field.telephone generates the correct type", () => {
  const result = field.telephone({
    label: "test",
    placeholder: "test",
  });
  expect(result.type).toStrictEqual("tel");
});

test("field.textArea generates the correct type", () => {
  const result = field.textArea({
    label: "test",
    placeholder: "test",
  });
  expect(result.type).toStrictEqual("textarea");
});
