describe("Admin registration flow", () => {
  afterEach(() => {
    // Call the utility endpoint to reset the database
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });
  // This test checks if the admin registration form is displayed when there is no admin
  it("should show the registration form if no admin exists", () => {
    // Intercept the API request and mock a response that indicates an admin exists
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/admin",
      },
      {
        statusCode: 200,
        body: false, // Mock response indicating an admin exists
      }
    ).as("checkAdminExists");
    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Assert that the registration form should be visible
    cy.get("form#admin-registration").should("exist");
  });

  // This test checks if the admin registration form is not displayed when an admin exists
  it("should not show the  the registration form if an admin exists", () => {
    // Intercept the API request and mock a response that indicates an admin exists
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/admin",
      },
      {
        statusCode: 200,
        body: true, // Mock response indicating an admin exists
      }
    ).as("checkAdminExists");

    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Assert that the registration form should not be visible
    cy.get("form#admin-registration").should("not.exist");
  });
});

describe("Admin registration, no admin exists", () => {
  // beforeEach(() => {
  //   cy.intercept(
  //     {
  //       method: "GET",
  //       url: "/api/v1/admin",
  //     },
  //     {
  //       statusCode: 200,
  //       body: false,
  //     }
  //   ).as("checkAdminExists");
  // });

  afterEach(() => {
    // Call the utility endpoint to reset the database
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });

  // This test covers the successful registration of an admin
  it("should register the admin successfully", () => {
    // Navigate to the registration page
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

    // Check for successful registration toast and redirection
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully created an admin account.");
    cy.location("pathname").should("eq", "/sign-in");
  });

  // This test checks that 'adminExists' is set to 'true' in localStorage after successful registration
  it("should set 'adminExists' to 'true' in localStorage after successful registration", () => {
    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Fill out the form with valid data
    cy.get("form#admin-registration").within(() => {
      cy.get('input[name="firstName"]').type("John");
      cy.get('input[name="lastName"]').type("Doe");
      cy.get('input[name="email"]').type("john.doe@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
      cy.get("#registerAdminButton").click();
    });

    // Verify that 'adminExists' is set to 'true' in localStorage
    cy.window().its("localStorage.adminExists").should("eq", "true");
  });

  it("handles network failure when submitting the form", () => {
    // Mock a network failure
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/admin/initialize",
      },
      { forceNetworkError: true }
    ).as("registrationRequest");

    cy.visit("http://localhost:3000/");
    // Fill out the form
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type("johndoe@example.com");
    cy.get('input[name="password"]').type("8$7t#Bc5*IlMOKm#");
    cy.get('input[name="confirmPassword"]').type("8$7t#Bc5*IlMOKm#");

    // Submit the form
    cy.get("#registerAdminButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should(
      "contain.text",
      "Error registering the admin:"
    );
  });
});

describe("Validation", () => {
  beforeEach(() => {
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
    cy.visit("http://localhost:3000/");
  });

  afterEach(() => {
    // Call the utility endpoint to reset the database
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });

  // Test to ensure that an exclamation mark button appears when invalid input is typed into the form
  it("should display an exclamation mark button when invalid input is typed", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible");
  });

  // Test to ensure that the tooltip appears when the error icon is clicked
  it("should display tooltip when error icon is clicked", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible").click();

    // Verify that the tooltip is displayed
    cy.get("#error-tooltip").should("be.visible");
  });

  // Test to ensure that the correct error message appears in the tooltip
  it("should display correct error message in tooltip", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible").click();

    // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains(
        "Please include an '@' in the email address. 'invalid-email' is missing an '@'."
      )
      .should("be.visible");
  });

  // Test to ensure that the tooltip disappears when the error icon is clicked again
  it("should hide tooltip when error icon is clicked again", () => {
    // Simulate typing invalid input
    cy.get('input[name="email"]').type("invalid-email");

    // Check that the button with the exclamation mark appears
    cy.get("#error-button").should("be.visible").click();

    // Click the error icon again
    cy.get("#error-button").should("be.visible").click();
    // Verify that the tooltip is hidden
    cy.get("#error-tooltip").should("not.exist");
  });

  // Test to ensure that an error appears when the passwords entered in the form do not match
  it("should show an error for mismatched passwords", () => {
    cy.get("form#admin-registration").within(() => {
      cy.get('input[name="firstName"]').type("New");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("newadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2Ss");
      cy.get("#registerAdminButton").click();
    });
    // Verify that the mismatched passwords error message is displayed
    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
    cy.get(".destructive").should("contain.text", "Passwords do not match.");
  });

  // Test to ensure that the 'Let's start' button is disabled if the form is invalid
  it("should disable the 'Let's start' button if the form is invalid", () => {
    cy.get("#registerAdminButton").should("be.disabled");
  });

  it("should enable the submit button only when all required fields are filled in", () => {
    cy.visit("http://localhost:3000/");
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get("button#registerAdminButton").should("be.disabled");
      cy.get('input[name="firstName"]').type("Test Name");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");

      cy.get("button#registerAdminButton").should("not.be.disabled");
    });
  });

  it("should handle whitespace in fields correctly", () => {
    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("  Admin  ");
      cy.get('input[name="lastName"]').type("  Test  ");
      cy.get('input[name="email"]').type("  testadmin@example.com  ");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
      cy.get("#registerAdminButton").click();
    });

    // Check for successful registration toast and redirection
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully created an admin account.");
    cy.location("pathname").should("eq", "/sign-in");
  });

  it("should display an error when entering symbols in first name", () => {
    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Fill out the form with invalid data (symbols in first name)
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("#Invalid^");
      cy.get('input[name="lastName"]').type("Last name");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");

      cy.get("#registerAdminButton").should("be.disabled");

      // Check that the button with the exclamation mark appears
      cy.get("#error-button").should("be.visible").click();

      // Verify that the correct tooltip message is displayed
      cy.get("#error-tooltip")
        .contains("Please match the format requested.")
        .should("be.visible");
    });
  });

  it("should display an error when entering symbols in last name", () => {
    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Fill out the form with invalid data (symbols in last name)
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("Valid");
      cy.get('input[name="lastName"]').type("#Invalid^");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");

      // Check that the submit button is disabled
      cy.get("#registerAdminButton").should("be.disabled");

      // Check that the button with the exclamation mark appears
      cy.get("#error-button").should("be.visible").click();

      // Verify that the correct tooltip message is displayed
      cy.get("#error-tooltip")
        .contains("Please match the format requested.")
        .should("be.visible");
    });
  });

  it("should prevent submitting passwords that do not meet criteria", () => {
    cy.visit("http://localhost:3000");

    cy.get('input[name="firstName"]').type("Valid");
    cy.get('input[name="lastName"]').type("Valid");
    cy.get('input[name="email"]').type("testadmin@example.com");
    // Fill out the form with invalid passwords
    cy.get('input[name="password"]').type("invalidpassword");
    cy.get('input[name="confirmPassword"]').type("invalidpassword");

    // Attempt to submit the form
    cy.get("#registerAdminButton").click();

    cy.get(".destructive").should("be.visible");
  });
});

describe("Admin Registration Edge Cases", () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: "GET",
        url: "/api/v1/admin",
      },
      {
        statusCode: 200,
        body: true,
      }
    ).as("checkAdminExists");
  });

  afterEach(() => {
    // Call the utility endpoint to reset the database
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });

  it("should not allow creation of a new admin if one already exists", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("adminExists", "false");
    });
    cy.visit("http://localhost:3000/");
    // Simulate user filling out the form with valid data
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("Test Name");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
      cy.get("#registerAdminButton").click();
    });

    // Assert that the error toast appears, indicating that an admin account already exists
    cy.get(".destructive")
      .should("be.visible")
      .contains("An admin account already exists.");
  });
});

describe("Admin Registration Form Tests", () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    // Call the utility endpoint to reset the database
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });

  it("should prevent multiple submissions by disabling the 'Submit' button after it has been clicked", () => {
    cy.visit("http://localhost:3000/");
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("Lia");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
    });

    cy.get("button#registerAdminButton").as("submitBtn");

    cy.get("@submitBtn").click();

    cy.get("@submitBtn").should("be.disabled");
  });

  it("should clear the form after a page refresh", () => {
    cy.visit("http://localhost:3000/");
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("Test Name");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
    });
    // Refresh the page
    cy.reload();
    // Verify that the form fields are empty
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').should("have.value", "");
      cy.get('input[name="lastName"]').should("have.value", "");
      cy.get('input[name="email"]').should("have.value", "");
      cy.get('input[name="password"]').should("have.value", "");
      cy.get('input[name="confirmPassword"]').should("have.value", "");
    });
  });

  it("should not persist form data after navigating away and back", () => {
    cy.visit("http://localhost:3000/");
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("Test Name");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("testadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
    });
    // Navigate away from the page
    cy.visit("http://localhost:3000/sign-in");
    // Navigate back to the registration page
    cy.visit("http://localhost:3000/");
    // Verify that the form fields are empty
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').should("have.value", "");
      cy.get('input[name="lastName"]').should("have.value", "");
      cy.get('input[name="email"]').should("have.value", "");
      cy.get('input[name="password"]').should("have.value", "");
      cy.get('input[name="confirmPassword"]').should("have.value", "");
    });
  });

  it("should prevent access to registration form after successful registration by using browser back button", () => {
    // Navigate to the registration page
    cy.visit("http://localhost:3000/");

    // Fill out the form with valid data and submit
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("New");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("newadmin@example.com");
      cy.get('input[name="password"]').type("$US0xxDQ5&Oy2SsO");
      cy.get('input[name="confirmPassword"]').type("$US0xxDQ5&Oy2SsO");
      cy.get("#registerAdminButton").click();
    });

    // Verify successful registration and redirection
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully created an admin account.");
    cy.location("pathname").should("eq", "/sign-in");

    // Simulate clicking the browser back button
    cy.go("back");

    // Verify that the user does not see the registration form
    cy.get('form[id="admin-registration"]').should("not.exist");
  });
});
