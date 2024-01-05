# @zluvo/forms

## 0.3.1

### Patch Changes

- d559582: Remove test.js from codebase

## 0.3.0

### Minor Changes

- c7b2665: - Deprecate `.handleSubmission()` API
  - Create a better `.create()` method
  - Create a `.validate()` method returned via `.create()` to both
    validate and return data with type inference.
  - Create `field` into a const object
  - Create a `plugins` API, returned via `.create()`

## 0.2.2

### Patch Changes

- ba2f073: Add name attribute to each field in Form.fields

## 0.2.1

### Patch Changes

- 9fd09a6: remove src.zip

## 0.2.0

### Minor Changes

- 4657de7: Added a .npmignore so only the necessary files are pushed to npm
- 307cc53: - Using `zod` for validation.
  - Added a `form.handleSubmission()` method to handle backend logic. Called within `process()`
  - Renamed `consume()` to `process()`
  - Created `process()` such that it runs in parallel
  - Created a `form.create()` method to create a form without having to create a class instance

## 0.1.2

### Patch Changes

- 60052eb: Change names of some APIs for better readability

## 0.1.1

### Patch Changes

- 0b4d1a7: Fixed Form.fields() method

## 0.1.0

### Minor Changes

- aa2d188: Added a .npmignore so only the necessary files are pushed to npm
