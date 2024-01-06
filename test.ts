import { form, field } from "./dist";

const registerForm = form.create("Register Form", {
  username: field.text({
    label: "Username",
    placeholder: "Your Username",
    required: true,
  }),
  password: field.password({
    label: "Password",
    placeholder: "Your password",
    required: true,
  }),
  age: field.number({
    label: "Age",
    placeholder: "Your Age",
  }),
});

async function validate() {
  const formData = new FormData();
  formData.append("username", "liam");
  formData.append("password", "asdf");
  const result = await registerForm.validate(formData);
  if (result.success) {
    const { age, username } = result.data;
    console.log(result.data.age);
  }
}
