---
"@zluvo/forms": minor
---

- Using `zod` for validation.
- Added a `form.handleSubmission()` method to handle backend logic. Called within `process()`
- Renamed `consume()` to `process()`
- Created `process()` such that it runs in parallel
- Created a `form.create()` method to create a form without having to create a class instance
