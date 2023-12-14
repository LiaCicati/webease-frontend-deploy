describe("Invite new user to create an account", () => {
  beforeEach(() => {
    // cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
    cy.visit("http://localhost:3000/");

    // Fill out the form with valid data
    cy.get('form[id="admin-registration"]').within(() => {
      cy.get('input[name="firstName"]').type("New");
      cy.get('input[name="lastName"]').type("Admin");
      cy.get('input[name="email"]').type("liacicati@gmail.com");
      cy.get('input[name="password"]').type("m$TKO7EH&OYktDYc");
      cy.get('input[name="confirmPassword"]').type("m$TKO7EH&OYktDYc");
      cy.get("#registerAdminButton").click();
    });
    cy.get('form[id="login-form"]').within(() => {
      cy.get("input#email").type("liacicati@gmail.com");
      cy.get("input#password").type("m$TKO7EH&OYktDYc");
      cy.get("button#loginButton").click();
      cy.visit("http://localhost:3000/settings/users");
    });
  });

  afterEach(() => {
    // Reset the database after each test
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });

  it("should send email to the user with an invitation link", () => {
    cy.get("#inviteNewUserButton").click();
    cy.get("#firstName").type("Loredana");
    cy.get("#lastName").type("Cicati");
    cy.get("#email").type("loredanabreslin@gmail.com");
    cy.get("#inviteUserButton").click();

    // Check for the success toast and new collection in the list
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully sent an invitation.");
  });

  it("should show error if provided email is invalid", () => {
    cy.get("#inviteNewUserButton").click();

    cy.get("input#firstName").type("John");
    cy.get("input#lastName").type("Doe");
    cy.get("input#email").type("invalidEmail");

    // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();

    // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains(
        "Please include an '@' in the email address. 'invalidEmail' is missing an '@'."
      )
      .should("be.visible");
  });

  it("should not send invitation with special characters in the first name", () => {
    cy.get("#inviteNewUserButton").click();

    cy.get("#firstName").type("John$&");

    cy.get("#inviteUserButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();

    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should not send invitation with special characters in the last name", () => {
    cy.get("#inviteNewUserButton").click();

    cy.get("#lastName").type("Doe$&");

    cy.get("#inviteUserButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();

    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should display form validation error if first name is empty", () => {
    cy.get("#inviteNewUserButton").click();
    cy.get("#firstName").type("John").clear();
    cy.get("#lastName").type("Doe");
    cy.get("#email").type("user@example.com");
    cy.get("#inviteUserButton").should("be.disabled");

    // // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();
    // // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains("Please fill in this field.")
      .should("be.visible");
  });

  it("should display form validation error if last name is empty", () => {
    cy.get("#inviteNewUserButton").click();
    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe").clear();
    cy.get("#email").type("user@example.com");
    cy.get("#inviteUserButton").should("be.disabled");

    // // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();
    // // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains("Please fill in this field.")
      .should("be.visible");
  });

  it("should display form validation error if email is empty", () => {
    cy.get("#inviteNewUserButton").click();
    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe");
    cy.get("#email").type("user@example.com").clear();
    cy.get("#inviteUserButton").should("be.disabled");

    // // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();
    // // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains("Please fill in this field.")
      .should("be.visible");
  });

  it("should prevent multiple submissions by disabling the 'Invite user' button after it has been clicked", () => {
    cy.get("#inviteNewUserButton").click();
    cy.get("#firstName").type("Loredana");
    cy.get("#lastName").type("Cicati");
    cy.get("#email").type("loredanabreslin@gmail.com");
    cy.get("#inviteUserButton").click();

    cy.get("#inviteUserButton").should("be.disabled");
  });

  describe("Resend invitation", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/settings/users");
      cy.get("#inviteNewUserButton").click();
      cy.get("#firstName").type("Loredana");
      cy.get("#lastName").type("Cicati");
      cy.get("#email").type("loredanabreslin@gmail.com");
      cy.get("#inviteUserButton").click();

      cy.visit("http://localhost:3000/settings/pending-invitations");
    });

    it("should display Resend Invitation button as disabled if the invitation did not expire yet", () => {
      cy.contains('button', 'Resend Invitation').should("be.disabled");
    });
  });
});
