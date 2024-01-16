# @zluvo/forms

A package to easily create forms, validate them, and organize related backend logic.

## Features ✨
- Lightweight and edge ready
- Integrates with zod
- Type safety
- Extendable
- Organized Conventions
- Client and server validation

## Cool stuff it can do 😎
### Be used in any framework ⚙
zluvo's APIs can be used in any framework or UI library. Displaying your form can be done in a couple of lines. Here's an example in react.

```tsx
function RegisterPage() {
	return (
		<h1>{registerForm.name}</h1>
		<form>
			{registerForm.fields.map((field) => (
				<>
					<label>{field.label}</label>
					<input {...field} />
				</>
			))}
		</form>
	)
}
```
### Easy form validation with `zod` ⚡
zluvo offers validation with the help of zod. All fields you create are automatically validated against their expected format. However, you can also provide your own custom zod validation to a field if necessary.

```ts
const welcomeForm = form.create("Welcome Form", {
  username: field.text({
    label: "Username",
    placeholder: "Username",
	required: true,
    validation: z.string().min(1).max(5),
  }),
  about: field.textArea({
    label: "About",
    placeholder: "About",
    validation: z.string().min(30).max(50),
  }),
});
```
### Automatic Casting 🔢
Whenever your form is submitted with `FormData`, you data is/are strings. We'll automatically cast your data to the appropiate type specified at the form's creation so you don't have to.

```ts
function handleForm(formData: FormData) {
    const result = registerForm.validate(formData);
        
    if (result.success) {
        // auto typed and casted as a number
        const { age } = result.data;
        console.log(age);
    }
}
```

### Create a Data Pipeline 🔀
Add a series of backend logic tied to your form using our pipeline API. Easily use and act upon data from a submission. Your pipeline will execute in parallel when ran!

```ts
// add user to database using drizzle
registerForm.pipeline.add((data) => {
    await db.insert(users).values(data);
})

// send email using resend
registerForm.pipeline.add((data) => {
    await resend.emails.send({
        from: 'hello@example.com',
        to: data.email,
        subject: 'Welcome!',
        html: `Welcome ${data.username}`
    });
})

// run the pipeline
registerForm.pipeline.run();
```

