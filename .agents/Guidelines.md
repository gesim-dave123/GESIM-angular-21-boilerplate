# Angular 21 Auth Boilerplate — Sign Up with Verification, Login and Forgot Password

> Tutorial built with **Angular 21.2.7**

A detailed guide on implementing a full-featured authentication boilerplate system in Angular 21.

---

## App Overview

The auth boilerplate is one of the most comprehensive Angular examples available, including the following features:

- Email sign up and verification
- JWT authentication with refresh tokens
- Role-based authorization with support for two roles (**User** & **Admin**)
- Forgot password and reset password functionality
- View and update profile section
- Admin section with account management (restricted to the Admin role)

### Fake Backend API

The app runs with a fake backend API by default, enabling it to run completely in the browser without a real backend. To disable it, remove the `fakeBackendProvider` lines from the app module. You can then connect to:

- A custom backend API
- .NET API
- Node.js + MongoDB API
- Node.js + MySQL API

### Fake Emails Displayed on Screen

There are no accounts registered by default — you must register and verify an account before logging in. The fake backend displays "email" messages on screen (e.g. verification links, password reset links) since it can't send real emails.

### First Account is an Admin

The first registered account is assigned the **Admin** role. Subsequent accounts receive the regular **User** role. Admins can access the admin section and manage all accounts; regular users can only update their own profile.

### JWT Authentication with Refresh Tokens

On successful authentication, the API returns:
- A short-lived **JWT access token** (expires in 15 minutes)
- A **refresh token** (expires in 7 days, stored in a cookie)

The Angular app starts a timer to refresh the JWT token 1 minute before it expires to keep the user logged in.

### Styled with Bootstrap 5

The app uses **Bootstrap 5.2** for styling.

---

## Implementation Sequence

Follow this step-by-step order when building the Angular 21 Auth Boilerplate from scratch. Each step builds on the previous one.

---

### Step 1 — Project Setup

```bash
ng new angular-auth-boilerplate
cd angular-auth-boilerplate
npm install bootstrap
```

- Add Bootstrap 5.2 CSS to `angular.json` styles array
- Configure `tsconfig.json` with `@app` and `@environments` path aliases
- Set up `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod) with `apiUrl`

---

### Step 2 — Define Models

Create the data shape before writing any logic.

1. `/src/app/_models/role.ts` — `Role` enum (`User`, `Admin`)
2. `/src/app/_models/account.ts` — `Account` model with all properties
3. `/src/app/_models/alert.ts` — `Alert`, `AlertType`, and `AlertOptions` models

---

### Step 3 — Create Helpers

These are foundational utilities that services and components depend on.

1. `/src/app/_helpers/must-match.validator.ts` — custom reactive forms validator for password confirmation
2. `/src/app/_helpers/jwt.interceptor.ts` — attaches JWT token to outgoing HTTP requests
3. `/src/app/_helpers/error.interceptor.ts` — handles 401/403 responses globally
4. `/src/app/_helpers/fake-backend.ts` — fake backend for local development (can be removed later)
5. `/src/app/_helpers/auth.guard.ts` — route guard for protecting authenticated/role-restricted routes
6. `/src/app/_helpers/app.initializer.ts` — auto-login on app start using refresh token cookie

---

### Step 4 — Create Services

Services must exist before components can use them.

1. `/src/app/_services/alert.service.ts` — alert messaging bridge between components
2. `/src/app/_services/account.service.ts` — all account API calls (login, register, refresh token, forgot password, etc.)

---

### Step 5 — Create Shared Components

1. `/src/app/_components/alert.component.html` — alert template
2. `/src/app/_components/alert.component.ts` — alert component logic

---

### Step 6 — Set Up the Root App

1. `/src/app/app.component.html` — root template with main nav, subnav outlet, alert, and main router outlet
2. `/src/app/app.component.ts` — subscribes to account observable to show/hide nav; handles logout
3. `/src/app/app-routing.module.ts` — top-level routes with auth guards and lazy loading
4. `/src/app/app.module.ts` — register interceptors, app initializer, fake backend provider, and all shared declarations
5. `/src/main.ts` — bootstrap entry point
6. `/src/index.html` — root HTML shell
7. `/src/styles.less` — global styles
8. `/src/polyfills.ts` — browser compatibility

---

### Step 7 — Build the Account Feature

This is the core auth flow: register → verify → login → forgot/reset password.

1. `/src/app/account/account.module.ts` — define the feature module
2. `/src/app/account/account-routing.module.ts` — routes for all account pages
3. `/src/app/account/layout.component.html` / `.ts` — account section shell; redirects if already logged in
4. `/src/app/account/register.component.html` / `.ts` — registration form with validation
5. `/src/app/account/verify-email.component.html` / `.ts` — email token verification on init
6. `/src/app/account/login.component.html` / `.ts` — login form; redirects to `returnUrl` on success
7. `/src/app/account/forgot-password.component.html` / `.ts` — email submission to trigger reset
8. `/src/app/account/reset-password.component.html` / `.ts` — token validation + new password form

---

### Step 8 — Build the Home Feature

1. `/src/app/home/home.component.html` — welcome message with logged-in user's first name
2. `/src/app/home/home.component.ts` — fetches current account from account service

> The home route is protected by the auth guard in the app routing module.

---

### Step 9 — Build the Profile Feature

1. `/src/app/profile/profile.module.ts` — define the feature module
2. `/src/app/profile/profile-routing.module.ts` — routes for details and update pages
3. `/src/app/profile/layout.component.html` / `.ts` — profile section shell
4. `/src/app/profile/details.component.html` / `.ts` — display name and email
5. `/src/app/profile/update.component.html` / `.ts` — update profile, change password, or delete account

---

### Step 10 — Build the Admin Feature

Admin features should be built last as they depend on the account service and auth guard being fully working.

1. `/src/app/admin/admin.module.ts` — define the feature module
2. `/src/app/admin/admin-routing.module.ts` — routes with subnav outlet and lazy-loaded accounts child
3. `/src/app/admin/layout.component.html` / `.ts` — admin section shell
4. `/src/app/admin/subnav.component.html` / `.ts` — admin navigation rendered in named outlet
5. `/src/app/admin/overview.component.html` / `.ts` — default admin landing page
6. `/src/app/admin/accounts/accounts.module.ts` — accounts child feature module
7. `/src/app/admin/accounts/accounts-routing.module.ts` — list, add, edit routes
8. `/src/app/admin/accounts/list.component.html` / `.ts` — display all accounts with delete
9. `/src/app/admin/accounts/add-edit.component.html` / `.ts` — dual-mode add/edit form

---

### Step 11 — Test the Full Auth Flow

Once everything is wired up, verify the following end-to-end flows:

| Flow | Steps |
|---|---|
| **Register & Verify** | Register → click verification link from fake email → login |
| **Login** | Login with verified account → redirected to home |
| **Auto Login** | Refresh the browser → app auto-authenticates via refresh token cookie |
| **Forgot Password** | Submit email → click reset link from fake email → set new password → login |
| **Role Access** | First account (Admin) can access `/admin`; second account (User) cannot |
| **Profile Update** | Update name/email/password from `/profile` |
| **Account Delete** | Delete own account from profile → auto logout |
| **Admin Manage** | Admin can add, edit, and delete any account from `/admin/accounts` |

---

### Step 12 — Switch to a Real Backend (Optional)

To replace the fake backend:

1. Open `/src/app/app.module.ts`
2. Remove the `fakeBackendProvider` and its import
3. Point `environment.apiUrl` in `environment.ts` to your real API
4. Ensure your API handles: `POST /accounts/register`, `POST /accounts/verify-email`, `POST /accounts/authenticate`, `POST /accounts/refresh-token`, `POST /accounts/revoke-token`, `POST /accounts/forgot-password`, `POST /accounts/validate-reset-token`, `POST /accounts/reset-password`, and standard CRUD at `/accounts`

---

## Code Documentation

The project was generated with Angular CLI (`ng new`), following the official [Angular Style Guide](https://angular.io/guide/styleguide) with minor customizations.

### Folder Structure

Each feature has its own folder (`account`, `admin`, `home`, `profile`). Shared/common code (components, services, models, helpers) is placed in folders prefixed with `_` to differentiate them from features.

### Lazy Loaded Feature Modules

The `account`, `admin`, and `profile` features are organized into self-contained feature modules with their own layouts, routes, and components, lazy loaded from the app routing module.

### Barrel Files

`index.ts` files in some folders group exported modules together for cleaner imports:
```ts
import { AccountService, AlertService } from '@app/_services';
```

### TypeScript Path Aliases

`@app` and `@environments` path aliases are configured in `tsconfig.json`, mapping to `/src/app` and `/src/environments` respectively, allowing clean imports without long relative paths.

---

## Components & Files Reference

### Alert Component Template
**Path:** `/src/app/_components/alert.component.html`

Renders alert notifications at the top of the page for each alert in the alerts array.

### Alert Component
**Path:** `/src/app/_components/alert.component.ts`

Manages adding and removing alerts in the UI. Subscribes to the alert service in `ngOnInit()` and auto-clears alerts on route changes. Unsubscribes on destroy to prevent memory leaks. Key methods:

- `removeAlert()` — removes a specific alert from the array
- `cssClasses()` — returns Bootstrap alert classes based on alert type

---

## Helpers

### App Initializer
**Path:** `/src/app/_helpers/app.initializer.ts`

Runs before the app starts. Calls `accountService.refreshToken()` to auto-authenticate the user if a valid refresh token cookie exists. Uses `catchError()` to handle failures gracefully. Registered in the app module via `APP_INITIALIZER`.

### Auth Guard
**Path:** `/src/app/_helpers/auth.guard.ts`

Implements `CanActivate` to protect restricted routes. Behavior:
- **Not logged in** → redirects to `/login` with `returnUrl`
- **Logged in but wrong role** → redirects to home page

Used in `app-routing.module.ts` to protect home, profile, and admin routes.

### Error Interceptor
**Path:** `/src/app/_helpers/error.interceptor.ts`

Intercepts HTTP responses. On **401 Unauthorized** or **403 Forbidden**, automatically logs out the account. Other errors are re-thrown to the calling service.

### Fake Backend API
**Path:** `/src/app/_helpers/fake-backend.ts`

Implements `HttpInterceptor` to intercept HTTP requests and return fake responses. A top-level `handleRoute()` function checks the request URL and method to dispatch to the appropriate handler. Non-intercepted routes are passed through to the real backend. Displays "email" messages on screen via `alertService.info()`.

### JWT Interceptor
**Path:** `/src/app/_helpers/jwt.interceptor.ts`

Implements `HttpInterceptor` to inject the JWT auth token into the `Authorization` header for requests to `environment.apiUrl` when the user is logged in.

### Must Match Validator
**Path:** `/src/app/_helpers/must-match.validator.ts`

A custom reactive forms validator that checks whether `password` and `confirmPassword` fields match.

---

## Models

### Account Model
**Path:** `/src/app/_models/account.ts`

Defines the properties of an account.

### Alert Models
**Path:** `/src/app/_models/alert.ts`

Contains three models:
- `Alert` — properties of an alert object
- `AlertType` — enumeration of alert types
- `AlertOptions` — configuration options for alerts

### Role Enum
**Path:** `/src/app/_models/role.ts`

Defines the supported roles in the application.

---

## Services

### Account Service
**Path:** `/src/app/_services/account.service.ts`

Handles all account-related backend communication: sign up, verification, authentication, token refresh, forgot/reset password, and CRUD operations.

Key behaviors:
- On login, publishes account details to all subscribers via `accountSubject.next(account)` and starts a silent refresh timer
- `logout()` revokes the refresh token, cancels the timer, publishes `null` to subscribers, and redirects to login
- Exposes an `account` observable (`Observable<Account>`) for components to subscribe to

### Alert Service
**Path:** `/src/app/_services/alert.service.ts`

Acts as the bridge between components and the alert component. Convenience methods: `success()`, `error()`, `info()`, `warn()`.

**Alert method parameters:**
- `message` *(string)* — plain text or HTML
- `options` *(AlertOptions, optional)*:
  - `id` — target alert component ID (default: `"default-alert"`)
  - `autoClose` — auto-close after 3 seconds (default: `true`)
  - `keepAfterRouteChange` — persist after one route change (default: `false`)

---

## Account Feature

### Account Routing Module
**Path:** `/src/app/account/account-routing.module.ts`

Defines routes for login, registration, and related functionality, with a parent route for the account layout component.

### Account Feature Module
**Path:** `/src/app/account/account.module.ts`

Defines the account feature module. Lazy loaded from the app routing module.

### Forgot Password Component
**Path:** `/src/app/account/forgot-password.component.html` / `.ts`

A simple form with a single email field. On submit, calls `accountService.forgotPassword()`. The fake backend displays a password reset "email" on screen with a reset link.

### Account Layout Component
**Path:** `/src/app/account/layout.component.html` / `.ts`

Root component/template for account pages (registration, authentication, verification). Redirects authenticated users to the home page.

### Login Component
**Path:** `/src/app/account/login.component.html` / `.ts`

Login form with email and password fields using reactive form validation. On success, redirects to `returnUrl` (or `/` by default). On failure, displays the error. Uses a convenience getter `f` for cleaner template access to form controls.

### Register Component
**Path:** `/src/app/account/register.component.html` / `.ts`

Registration form with: title, first name, last name, email, password, confirm password, and accept T&Cs checkbox. Validation includes min password length of 6 and password match check. On success, redirects to login page and displays a verification "email".

### Reset Password Component
**Path:** `/src/app/account/reset-password.component.html` / `.ts`

Validates the reset token from the URL query string on init. Renders one of three views:
- **Validating** — token check in progress
- **Invalid** — validation failed, link to forgot password
- **Valid** — password reset form (password + confirm password)

On success, redirects to login with a success message.

### Verify Email Component
**Path:** `/src/app/account/verify-email.component.html` / `.ts`

Verifies a new account using the token from the URL query string on init. Renders one of two views:
- **Verifying** — check in progress
- **Failed** — verification failed, link to forgot password page

On success, redirects to login with a success message.

---

## Admin Feature

### Admin Routing Module
**Path:** `/src/app/admin/admin-routing.module.ts`

Defines routes for the admin overview and accounts section. The `SubNavComponent` is rendered in the `subnav` named outlet for all admin pages. The accounts module is lazy loaded as a child.

### Admin Feature Module
**Path:** `/src/app/admin/admin.module.ts`

Defines the admin feature module. Lazy loaded from the app routing module.

### Admin Layout Component
**Path:** `/src/app/admin/layout.component.html` / `.ts`

Root component/template for all `/admin` pages.

### Admin Overview Component
**Path:** `/src/app/admin/overview.component.html` / `.ts`

Default admin section component. Displays basic info and a link to the accounts subsection.

### Admin Sub Nav Component
**Path:** `/src/app/admin/subnav.component.html` / `.ts`

Navigation for the admin section. Rendered in the `subnav` router outlet below the main nav.

### Admin » Accounts Routing Module
**Path:** `/src/app/admin/accounts/accounts-routing.module.ts`

Routes for listing, adding, and editing accounts. Add and edit routes both use the `AddEditComponent`, which adapts its behavior based on the route.

### Admin » Accounts Feature Module
**Path:** `/src/app/admin/accounts/accounts.module.ts`

Defines the accounts feature module as a child of the admin feature module.

### Admin » Accounts Add/Edit Component
**Path:** `/src/app/admin/accounts/add-edit.component.html` / `.ts`

Dynamic form supporting both add and edit modes:
- **Add mode** — empty form, password required
- **Edit mode** — pre-populated with account data, password optional

On submit, creates or updates an account via the account service, then redirects to the accounts list with a success message.

### Admin » Accounts List Component
**Path:** `/src/app/admin/accounts/list.component.html` / `.ts`

Displays all accounts with create, edit, and delete buttons. The `deleteAccount()` method sets `account.isDeleting = true` (shows a spinner) before calling the delete API and removing the account from the UI.

---

## Profile Feature

### Profile Routing Module
**Path:** `/src/app/profile/profile-routing.module.ts`

Routes for profile details and update, with a parent route for the profile layout.

### Profile Feature Module
**Path:** `/src/app/profile/profile.module.ts`

Defines the profile feature module. Lazy loaded from the app routing module.

### Profile Layout Component
**Path:** `/src/app/profile/layout.component.html` / `.ts`

Root component/template for all `/profile` pages.

### Profile Details Component
**Path:** `/src/app/profile/details.component.html` / `.ts`

Displays the authenticated account's name and email with a link to the update page.

### Profile Update Component
**Path:** `/src/app/profile/update.component.html` / `.ts`

Form for updating profile details, changing password, or deleting the account. Pre-populated from `accountService.accountValue`. On successful update, redirects to the profile details page. On successful delete, logs out the user with a confirmation message.

---

## Core App Files

### App Routing Module
**Path:** `/src/app/app-routing.module.ts`

Top-level routes:
| Route | Module/Component | Guard |
|---|---|---|
| `/` | Home Component | Auth Guard |
| `/account` | Account Module (lazy) | — |
| `/profile` | Profile Module (lazy) | Auth Guard |
| `/admin` | Admin Module (lazy) | Auth Guard + Admin Role |

### App Component
**Path:** `/src/app/app.component.html` / `.ts`

Root component. Subscribes to the account observable to show/hide the main nav. Contains:
- Main nav bar (authenticated only)
- Named `subnav` router outlet
- Global alert component
- Main router outlet

The `logout()` method is bound to the logout link in the nav bar.

### App Module
**Path:** `/src/app/app.module.ts`

Root module of the application. Contains the `fakeBackendProvider` registration. To switch to a real backend, remove the fake backend provider.

---

## Configuration Files

### Environment Configs

| File | Purpose |
|---|---|
| `/src/environments/environment.ts` | Development config |
| `/src/environments/environment.prod.ts` | Production config (used with `ng build --configuration production`) |

Environment config is imported via `import { environment } from '@environments/environment'`.

### `tsconfig.json`
**Path:** `/tsconfig.json`

TypeScript compiler config. Key addition: `paths` property mapping `@app` and `@environments` aliases to their respective directories.

### `package.json`
**Path:** `/package.json`

Project configuration including dependencies and scripts (`npm start`, `npm run build`, etc.).

---

## Entry Points

| File | Description |
|---|---|
| `/src/index.html` | Initial HTML page loaded by the browser; Angular CLI injects bundled JS here |
| `/src/main.ts` | Angular entry point; bootstraps the application |
| `/src/polyfills.ts` | Browser compatibility polyfills (generated by Angular CLI) |
| `/src/styles.less` | Global LESS/CSS styles applied throughout the application |