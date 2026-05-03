# Recovery Log: Angular 21 Auth Boilerplate

This document tracks all changes made to restore the codebase to a functional, module-based state aligned with the project guidelines.

## 1. Structural & Architectural Changes

### Standalone to Module-Based Transition
- **`src/main.ts`**: Replaced `bootstrapApplication` with `platformBrowserDynamic().bootstrapModule(AppModule)`.
- **Deleted Files**: Removed redundant standalone-related files:
    - `src/app/app.ts`
    - `src/app/app.config.ts`
    - `src/app/app.routes.ts`
- **Feature Modules**: Created `HomeModule` and updated `AccountModule`, `AdminModule`, and `ProfileModule` to ensure they are properly self-contained and lazy-loaded.

### File Renames & Standardizations
- **`src/app/_helpers/must_match.validator.ts`** → **`src/app/_helpers/must-match.validator.ts`**: Renamed for consistency with guidelines and barrel imports.

---

## 2. Configuration Updates

### `package.json`
- Added `bootstrap: ^5.2.3` to dependencies.
- Added `@angular/platform-browser-dynamic: ^21.2.0` to dependencies.

### `tsconfig.json`
- Added path alias mapping: `"@environments/*": ["src/environments/*"]`.

### `angular.json`
- Added `node_modules/bootstrap/dist/css/bootstrap.min.css` to the global `styles` array.

---

## 3. Surgical Code Repairs

### Core Logic Fixes
- **`src/app/_helpers/fake-backend.ts`**: 
    - Full refactor to fix severe syntax errors (broken switch/case and dangling braces).
    - Fixed routing logic for account CRUD operations.
    - Standardized `fakeBackendProvider` export.
- **`src/app/_helpers/jwt.interceptor.ts`**: Changed token property access from `account.token` to `account.jwtToken` to match the Model.
- **`src/app/_helpers/app.initializer.ts`**: Added missing `of` import from `rxjs`.
- **`src/app/_helpers/auth.guard.ts`**: Fixed type access for route roles (`route.data['roles']`) and added missing null checks.

### Component & Service Fixes
- **`src/app/_components/alert.component.ts`**:
    - Fixed syntax error in `removeAlert` logic.
    - Updated `cssClasses` to handle `AlertType` enum mapping correctly with type casting.
- **`src/app/_services/alert.service.ts`**: Fixed type mismatch where `AlertType` (enum) was being assigned to a `string` property.
- **`src/app/app.component.ts`**: Fixed typo `AccoutService` → `AccountService`.
- **`src/app/account/account.module.ts`**: Fixed invalid `NgModule` import path.
- **`src/app/account/reset-password.component.ts`**:
    - Added missing `TokenStatus` enum and state management logic.
    - Fixed template variable scoping.

---

## 4. Template (HTML) Standardizations
Fixed dozens of errors caused by **Angular Strict Mode** across all feature folders:
- **Index Signature Access**: Replaced property access like `f.email.errors` with `f['email'].errors` in:
    - `login.component.html`
    - `register.component.html`
    - `forgot-password.component.html`
    - `reset-password.component.html`
    - `update.component.html`
    - `add-edit.component.html`
- **Broken Tags**: Fixed unclosed `div` and `form` tags in `login.component.html` and `register.component.html`.
- **Property Binding**: Corrected `[formGroup]` and `[ngClass]` bindings that were missing necessary module imports.

---

## 5. Verification
- **Build Status**: Successful (`ng build`)
- **Bundle Analysis**: Verified generation of lazy chunks for all feature modules.
- **Style Injection**: Verified Bootstrap 5.2.3 integration in the final bundle.
