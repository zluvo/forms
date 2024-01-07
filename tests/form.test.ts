const { form, field } = require("../dist");

test("form generates correct name", () => {
  const testForm = form.create("Test Form", {});
  expect(testForm.name).toStrictEqual("Test Form");
});

test("form generates fields correctly", () => {
  const testForm = form.create("Test Form", {
    name: field.text({
      label: "Name",
      placeholder: "Your Name",
    }),
  });
  expect(testForm.fields[0]?.label).toStrictEqual("Name");
  expect(testForm.fields[0]?.placeholder).toStrictEqual("Your Name");
  expect(testForm.fields[0]?.type).toStrictEqual("text");
  expect(testForm.fields[0]?.name).toStrictEqual("name");
});

test("form generates fields correctly with name passed on field", () => {
  const testForm = form.create("Test Form", {
    name: field.text({
      name: "something else",
      label: "Name",
      placeholder: "Your Name",
    }),
  });
  expect(testForm.fields[0]?.name).toBe("something else");
});
