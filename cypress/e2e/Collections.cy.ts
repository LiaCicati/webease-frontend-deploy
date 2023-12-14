describe("Collections Page", () => {
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
    cy.get('form[id="login-form"]').within(() => {
      cy.get("input#email").type("newadmin@example.com");
      cy.get("input#password").type("m$TKO7EH&OYktDYc");
      cy.get("button#loginButton").click();
    });
    cy.visit("http://localhost:3000/content-type-builder/collections");
  });

  afterEach(() => {
    // Reset the database after each test
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
  });

  it("should add a new collection", () => {
    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("Articles");
    cy.get("#description").type("List of articles");
    cy.get("#addCollectionButton").click();

    // Check for the success toast and new collection in the list
    cy.get(".success")
      .should("be.visible")
      .contains("You have successfully added a new collection.");
    cy.contains("Articles").should("be.visible");
    cy.url().should("include", "/content-type-builder/collections/Articles");
  });

  it("should open and close the dialog", () => {
    cy.get("#createNewCollectionButton").click();
    cy.get("form#collection-form").should("be.visible");

    // Close the dialog
    cy.contains("Cancel").click();
    cy.get("form#collection-form").should("not.exist");
  });

  it("should display the default message when no collections are selected", () => {
    cy.contains("First, design the content model").should("be.visible");
    cy.contains("Design your content model").should("be.visible");
  });

  it("should not add a collection when name or description is empty", () => {
    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("Articles").clear();
    cy.get("#description").type("Sample description").clear();
    cy.get("#addCollectionButton").should("be.disabled");

    // // Assert that the form validation error is shown
    cy.get("#error-button").should("be.visible").click();
    // // Verify that the correct tooltip message is displayed
    cy.get("#error-tooltip")
      .contains("Please fill in this field.")
      .should("be.visible");
  });

  it("should disable the save button until the form is valid", () => {
    cy.get("#createNewCollectionButton").click();
    cy.get("#addCollectionButton").should("be.disabled");

    cy.get("#name").type("Videos");
    cy.get("#addCollectionButton").should("be.disabled");

    cy.get("#description").type("List of videos");
    cy.get("#addCollectionButton").should("not.be.disabled");
  });

  it("should reset the form upon clicking Cancel", () => {
    // Open the dialog
    cy.get("#createNewCollectionButton").click();
    // Fill in the form
    cy.get("#name").type("Test Collection");
    cy.get("#description").type("This is a test collection.");

    // Click on the cancel button
    cy.get("#cancelButton").click();

    // Open the dialog again
    cy.get("#createNewCollectionButton").click();

    // Assert that the form fields are empty
    cy.get("#name").should("have.value", "");
    cy.get("#description").should("have.value", "");
  });

  it("should reset the form upon clicking X", () => {
    // Open the dialog
    cy.get("#createNewCollectionButton").click();
    // Fill in the form
    cy.get("#name").type("Test Collection");
    cy.get("#description").type("This is a test collection.");

    // Click on the X button
    cy.get(".close-icon").click();

    // Open the dialog again
    cy.get("#createNewCollectionButton").click();

    // Assert that the form fields are empty
    cy.get("#name").should("have.value", "");
    cy.get("#description").should("have.value", "");
  });

  it("should reset the form upon clicking outside", () => {
    // Open the dialog
    cy.get("#createNewCollectionButton").click();
    // Fill in the form
    cy.get("#name").type("Test Collection");
    cy.get("#description").type("This is a test collection.");

    // Click outside the dialog to close it
    cy.get(".overlay-bg").click({ force: true });

    // Open the dialog again
    cy.get("#createNewCollectionButton").click();

    // Assert that the form fields are empty
    cy.get("#name").should("have.value", "");
    cy.get("#description").should("have.value", "");
  });

  it("should reset the form upon pressing the ESC key", () => {
    // Open the dialog
    cy.get("#createNewCollectionButton").click();
    // Fill in the form
    cy.get("#name").type("Test Collection");
    cy.get("#description").type("This is a test collection.");

    // Press the ESC key
    cy.get("body").type("{esc}");

    // Open the dialog again
    cy.get("#createNewCollectionButton").click();

    // Assert that the form fields are empty
    cy.get("#name").should("have.value", "");
    cy.get("#description").should("have.value", "");
  });

  it("should not allow adding collections with the same name", () => {
    // Open the dialog and create a collection
    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("Unique Collection");
    cy.get("#description").type("This is a unique test collection.");
    cy.get("#addCollectionButton").click();

    // Check if it was added successfully (based on toast or other indicators)
    cy.contains("You have successfully added a new collection.").should(
      "be.visible"
    );
    cy.visit("http://localhost:3000/content-type-builder/collections");
    // Attempt to add the same collection again
    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("Unique Collection");
    cy.get("#description").type("This is a unique test collection.");
    cy.get("#addCollectionButton").click();
    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should(
      "contain.text",
      "Collection name already exists!"
    );
  });

  it("handles network failure when submitting the form", () => {
    // Mock a network failure
    cy.intercept(
      {
        method: "POST",
        url: "/api/v1/collections",
      },
      { forceNetworkError: true }
    ).as("addCollectionRequest");

    cy.visit("http://localhost:3000/content-type-builder/collections");

    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("Collection");
    cy.get("#description").type("This is a test collection.");
    cy.get("#addCollectionButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Network Error");
  });

  it('should display "No collections available." when no collections exist', () => {
    cy.get("ul").contains("No collections available.").should("be.visible");
  });

  it("should display an error when entering symbols in collection name", () => {
    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("#Invalid^");
    cy.get("#description").type("This is a test collection.");
    cy.get("#addCollectionButton").should("be.disabled");

    cy.get("#error-button").should("be.visible").click();

    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  describe("Collections Page", () => {
    beforeEach(() => {
      cy.get("#createNewCollectionButton").click();
      cy.get("#name").type("Articles");
      cy.get("#description").type("List of articles");
      cy.get("#addCollectionButton").click();
    });
    it("should render the collections list", () => {
      cy.contains("Content-Type Builder");
      cy.contains("Collection types");
      cy.contains("Articles").should("be.visible");
    });

    it("should display collection details on click", () => {
      cy.visit("http://localhost:3000/content-type-builder/collections");
      cy.contains("Articles").click();
      cy.url().should("include", "#Articles");
      cy.contains("Articles").should("be.visible");
      cy.contains("List of articles").should("be.visible");
    });
  });
});
