describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    // Fill out the form with valid data
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("New");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("newadmin@example.com");
      cy.get('input[name="password"]').type("m$TKO7EH&OYktDYc");
      cy.get('input[name="confirmPassword"]').type("m$TKO7EH&OYktDYc");
      cy.get("#registerAdminButton").click();
    });
  });
  afterEach(() => {
    // Call the utility endpoint to reset the database
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });
  // This test checks if the login form is displayed properly
  it("should render the login form correctly", () => {
    // Navigate to the login page
    cy.visit("http://localhost:3000/sign-in");

    // Assert that the login form and its elements are visible
    cy.get("form#login-form").should("exist");
    cy.get("input#email").should("exist");
    cy.get("input#password").should("exist");
    cy.get("button#loginButton").should("exist");
  });

  // This test checks if the login is successful and user is redirected
  it("should display success toast and navigate to account page upon successful login", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/admin",
      },
      {
        statusCode: 200,
        body: false,
      }
    ).as("checkAdminExists");

    // Navigate to the login page and fill out the form
    cy.visit("http://localhost:3000/sign-in");
    cy.get("input#email").type("newadmin@example.com");
    cy.get("input#password").type("m$TKO7EH&OYktDYc");
    cy.get("button#loginButton").click();

    // Assert success toast is displayed and user is redirected
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully signed in.");
    cy.url().should("include", "/account");
  });

  it("should display error toast when correct email but incorrect password is provided", () => {
    cy.visit("http://localhost:3000/sign-in");

    cy.get("input#email").type("newadmin@example.com");
    cy.get("input#password").type("incorrectPassword");
    cy.get("button#loginButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should(
      "contain.text",
      "Incorrect email or password."
    );
  });

  it("should display error toast when valid but incorrect email is provided", () => {
    cy.visit("http://localhost:3000/sign-in");

    cy.get("input#email").type("validbutincorrect@example.com");
    cy.get("input#password").type("m$TKO7EH&OYktDYc");
    cy.get("button#loginButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should(
      "contain.text",
      "The requested data was not found."
    );
  });

  it("should display error toast when both email and password are incorrect", () => {
    cy.visit("http://localhost:3000/sign-in");

    cy.get("input#email").type("incorrectemail@example.com");
    cy.get("input#password").type("incorrectPassword");
    cy.get("button#loginButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should(
      "contain.text",
      "The requested data was not found."
    );
  });

  it("should display form validation error for invalid email", () => {
    cy.visit("http://localhost:3000/sign-in");

    cy.get("input#email").type("invalidEmail");
    cy.get("input#password").type("password123");

    // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();

    // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains(
        "Please include an '@' in the email address. 'invalidEmail' is missing an '@'."
      )
      .should("be.visible");
  });

  it("should have the login button disabled with invalid form inputs", () => {
    cy.visit("http://localhost:3000/sign-in");

    cy.get("input#email").type("invalidEmail");
    cy.get("input#password").type("password123");

    cy.get("button#loginButton").should("be.disabled");
  });

  it("should display form validation error for empty fields", () => {
    cy.visit("http://localhost:3000/sign-in");

    cy.get("input#email").type("test@example.com").clear();
    cy.get("input#password").type("password123").clear();

    // // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();
    // // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains("Please fill in this field.")
      .should("be.visible");
  });

  it("handles network failure when submitting the form", () => {
    // Mock a network failure
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/users/login",
      },
      { forceNetworkError: true }
    ).as("loginRequest");

    cy.visit("http://localhost:3000/sign-in");
    // Fill out the form
    cy.get("input#email").type("newadmin@example.com");
    cy.get("input#password").type("m$TKO7EH&OYktDYc");

    // Submit the form
    cy.get("button#loginButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should(
      "contain.text",
      "Error registering the admin: Network Error"
    );
  });

  it("should prevent multiple submissions by disabling the 'Submit' button after it has been clicked", () => {
    cy.visit("http://localhost:3000/sign-in");
    // Fill out the form
    cy.get("input#email").type("newadmin@example.com");
    cy.get("input#password").type("m$TKO7EH&OYktDYc");

    // Submit the form
    cy.get("button#loginButton").click();

    cy.get("button#loginButton").should("be.disabled");
  });

  it("should handle whitespace in fields correctly", () => {
    cy.visit("http://localhost:3000/sign-in");

    // Fill out the form
    cy.get("input#email").type("    newadmin@example.com     ");
    cy.get("input#password").type("m$TKO7EH&OYktDYc");
    // Submit the form
    cy.get("button#loginButton").click();

    // Assert success toast is displayed and user is redirected
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully signed in.");
    cy.url().should("include", "/account");
  });
});
