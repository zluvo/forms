const { form, field, validator } = require("./dist");

const registerForm = form.create("Register Form", {
  username: field.text({
    label: "Username",
    placeholder: "Your Username",
    validation: validator.string().min(1),
  }),
  password: field.password({
    label: "Password",
    placeholder: "Your Password",
  }),
  age: field.number({
    label: "Age",
    placeholder: "Your Age",
  }),
});

function email() {
  return async (data) => {
    console.log("Adding 10 to age");
    console.log(data.age + 10);
  };
}
registerForm.plugins.add((data) => email(data.age));
registerForm.plugins.add(async (data) => {
  console.log(data.password);
});

const formData = new FormData();
formData.append("username", "test");
formData.append("password", "asdf");
formData.append("age", "6");
async function validate() {
  const result = await registerForm.validate(formData);
  if (result.success) {
    const { age, username, password } = result.data;
    console.log(age);
    console.log(username);
    console.log(password);
    await registerForm.plugins.run();
  }
}
validate();
