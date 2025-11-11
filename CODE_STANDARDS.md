# Code Patterns & Development Standards

This document outlines the development standards and best practices to be followed by all contributors. Our goal is to produce code that is **FAST**, **SAFE**, **MAINTAINABLE**, **SIMPLE**, and **CONSISTENT**.

## General Principles

- **Simplicity Over Complexity:** Choose the simplest solution that effectively solves the problem.
- **Write for Humans:** Code is read more often than it is written. Prioritize clarity and readability.
- **Consistency is Key:** Adhere to the patterns and conventions established in this document and the existing codebase.
- **Don't Repeat Yourself (DRY):** Abstract and reuse code where it makes sense, but avoid premature abstraction.

---

## Backend (.NET 8)

1.  **Architecture: Clean Architecture**
    *   Follow the separation of concerns: **Controllers -> Services -> Data Access Layer**.
    *   **Controllers:** Handle HTTP requests and responses. Keep them thin. They should only orchestrate calls to services.
    *   **Services:** Contain the core business logic. They should be stateless.
    *   **Data Access Layer:** Responsible for all database interactions. Use repositories or similar patterns.

2.  **Naming Conventions**
    *   **Classes, Methods, Properties:** `PascalCase`
    *   **Local Variables, Method Parameters:** `camelCase`
    *   **Interfaces:** `IPascalCase` (e.g., `IPlanReviewService`).

3.  **Asynchronous Programming**
    *   Use `async/await` for all I/O-bound operations (database calls, HTTP requests).
    *   Propagate `async` all the way up the call stack. Avoid `async void` except for event handlers.
    *   Use `ConfigureAwait(false)` in service/library layers to avoid deadlocks.

4.  **Dependency Injection (DI)**
    *   Register all services and repositories in `Program.cs`.
    *   Services should depend on abstractions (`I...Service`), not concrete implementations.

5.  **Error Handling**
    *   Use a global exception handling middleware to catch unhandled exceptions and return a consistent JSON error format.
    *   For expected errors (e.g., "Not Found"), return appropriate `IActionResult` types (e.g., `NotFound()`, `BadRequest()`).

6.  **Password Hashing**
    *   Use **Argon2** for all password hashing. This is a strong, modern hashing algorithm recommended for password storage.

---

## Frontend (React & TypeScript)

1.  **Component Design**
    *   Use **Functional Components** with Hooks exclusively.
    *   Keep components **small and focused** on a single responsibility.
    *   Separate logic from presentation. Use custom hooks (`use...`) to encapsulate complex logic.

2.  **State Management**
    *   **Local State:** Use `useState` for simple, component-local state.
    *   **Shared State:** Start with `useContext` for simple, low-frequency state sharing. If state becomes complex, we will evaluate a dedicated library like **Zustand**.

3.  **Naming Conventions**
    *   **Components, Types, Interfaces:** `PascalCase` (e.g., `PlanUploader.tsx`, `interface PlanReview`).
    *   **Functions, Variables, Hooks:** `camelCase` (e.g., `useAIReview`, `const reviewId`).

4.  **Styling**
    *   Use **TailwindCSS** utility classes directly in the JSX.
    *   Avoid writing custom `.css` files. Create reusable, styled components for complex elements if needed.

5.  **API Interaction**
    *   Centralize all API client logic in the `/src/api` directory.
    *   Use a lightweight wrapper around `fetch` or a library like `axios` for making requests.
    *   Define clear TypeScript interfaces for all API request and response objects.

6.  **Type Safety**
    *   **Be explicit with types.** Avoid using `any` wherever possible.
    *   Leverage TypeScript's utility types (`Partial`, `Omit`, etc.) to keep code DRY.

---

## Git & Version Control

1.  **Branching Strategy**
    *   All new work must be done on a feature branch, named descriptively (e.g., `feature/user-authentication`, `bugfix/login-error`).
    *   Branches should be created from the `main` branch.

2.  **Commits**
    *   Commit messages should be written in the present tense (e.g., "Add user registration endpoint").
    *   Keep commits small and atomic, representing a single logical change.

3.  **Pull Requests (PRs)**
    *   All code must be reviewed via a Pull Request before being merged into `main`.
    *   The PR description should clearly explain the **why** and **what** of the change.
    *   Ensure all automated checks (builds, tests) are passing before requesting a review.
