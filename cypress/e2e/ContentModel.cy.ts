describe("Define content model", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
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
      window.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiJ9.eyJfdXNlclJvbGUiOiJBRE1JTiIsIl9pZCI6InVnZmlieCIsImV4cCI6MTcwMjk5OTk2NiwiaWF0IjoxNzAyMzk1MTY2fQ.-5mFKPks1x7t3tdRddSqF-CxwtNaBqLZDAGYPjufr9g"
      );
      cy.setCookie(
        "token",
        "eyJhbGciOiJIUzI1NiJ9.eyJfdXNlclJvbGUiOiJBRE1JTiIsIl9pZCI6InVnZmlieCIsImV4cCI6MTcwMjk5OTk2NiwiaWF0IjoxNzAyMzk1MTY2fQ.-5mFKPks1x7t3tdRddSqF-CxwtNaBqLZDAGYPjufr9g"
      );
    });

    cy.visit("http://localhost:3000/content-type-builder/collections");
    cy.get("#createNewCollectionButton").click();
    cy.get("#name").type("Articles");
    cy.get("#description").type("List of articles");
    cy.get("#addCollectionButton").click();
    cy.url().should("include", "/content-type-builder/collections/Articles");
  });

  afterEach(() => {
    // Reset the database after each test
    cy.request("POST", "http://localhost:8080/api/v1/utils/resetDatabase");
    window.localStorage.clear()
    cy.clearCookie("token");
  });

  it("should add a new text field with both basic and advanced settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("Title");
    cy.get("#long-text").click();
    
    cy.get("#advanced").click();
    cy.get("#required").click();
    cy.get("#defaultValue").type("Title");
    cy.get("#unique").click();
    cy.get("#maximumLength").type("25");
    cy.get("#minimumLength").type("2");
    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Title");
  });

  it("should add a new text field with only basic settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("Title");
    cy.get("#long-text").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Title");
  });

  it("should not add a new text field with missing name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#long-text").click();

    cy.get("#finishButton").should("be.disabled");
  });

  it("should not add a new text field with duplicate name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("Title");
    cy.get("#long-text").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("Title");
    cy.get("#long-text").click();

    cy.get("#finishButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
  });

  it("should not add a new text field with special characters in the name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("Title$&");
    cy.get("#long-text").click();

    cy.get("#finishButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();

    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should add a new rich text field with both basic and advanced settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("RichText").click();
    cy.get("#name").type("Content");
    cy.get("#advanced").click();
    cy.get("#required").click();
    cy.get("#defaultValue").type("Content");

    cy.get("#maximumRichTextLength").type("255");

    cy.get("#minimumLength").type("2");
    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Content");
  });

  it("should add a new rich text field with only basic settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("RichText").click();
    cy.get("#name").type("Content");

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Content");
  });

  it("should not add a new rich text field with missing name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("RichText").click();

    cy.get("#finishButton").should("be.disabled");
  });

  it("should not add a new rich text field with special characters in the name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("RichText").click();
    cy.get("#name").type("%Content&&");

    cy.get("#finishButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();
    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should not add a new rich text field with duplicate name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("RichText").click();
    cy.get("#name").type("Content");

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("RichText").click();
    cy.get("#name").type("Content");

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
  });

  it("should add a new number field with both basic and advanced settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Number").click();
    cy.get("#name").type("Age");
    cy.get(".select").click();

    cy.get("#bigInteger").click();

    cy.get("#advanced").click();
    cy.get("#required").click();
    cy.get("#defaultValue").clear().type("0");
    cy.get("#unique").click();
    cy.get("#maximumValue").type("40");

    cy.get("#minimumValue").type("18");
    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Age");
  });

  it("should add a new number field with only basic settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Number").click();
    cy.get("#name").type("Age");
    cy.get(".select").click();

    cy.get("#bigInteger").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Age");
  });

  it("should not add a new number field with missing name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Number").click();

    cy.get(".select").click();
    cy.get("#bigInteger").click();

    cy.get("#finishButton").should("be.disabled");
  });

  it("should not add a new number field with special characters in the name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Number").click();
    cy.get("#name").type("%Aget&***&");

    cy.get(".select").click();
    cy.get("#bigInteger").click();

    cy.get("#finishButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();
    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should not add a new number field with duplicate name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Number").click();
    cy.get("#name").type("Age");
    cy.get(".select").click();

    cy.get("#bigInteger").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Number").click();
    cy.get("#name").type("Age");
    cy.get(".select").click();

    cy.get("#bigInteger").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
  });

  it("should add a new date field with both basic and advanced settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Date").click();
    cy.get("#name").type("Date");
    cy.get(".select").click();

    cy.get("#date").click();

    cy.get("#advanced").click();
    cy.get("#required").click();
    cy.get("#defaultValue").clear().type("2023-09-23");
    cy.get("#unique").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Date");
  });

  it("should add a new date field with only basic settings", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Date").click();
    cy.get("#name").type("Date");
    cy.get(".select").click();
    cy.get("#date").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Field added successfully.");
    cy.get("#fieldsTable").should("exist");
    cy.get("#fieldsTable").contains("Date");
  });

  it("should not add a new date field with missing name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Date").click();

    cy.get(".select").click();
    cy.get("#date").click();

    cy.get("#finishButton").should("be.disabled");
  });

  it("should not add a new date field with special characters in the name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Date").click();
    cy.get("#name").type("%Date&***&");

    cy.get(".select").click();
    cy.get("#date").click();

    cy.get("#finishButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();
    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should not add a new date field with duplicate name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Date").click();
    cy.get("#name").type("Date");
    cy.get(".select").click();
    cy.get("#date").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Date").click();
    cy.get("#name").type("Date");
    cy.get(".select").click();
    cy.get("#date").click();

    cy.get("#finishButton").should("be.enabled");
    cy.get("#finishButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
  });

  it("should not add a new field with numeric values in the name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("123");

    cy.get("#long-text").click();

    cy.get("#finishButton").should("be.disabled");
    cy.get("#error-button").should("be.visible").click();
    cy.get("#error-tooltip")
      .contains("Please match the format requested.")
      .should("be.visible");
  });

  it("should not add a new field with spaces in the name", () => {
    cy.get("#addNewFieldButton").click();
    cy.get(".card").contains("Text").click();
    cy.get("#name").type("  ");
    cy.get("#long-text").click();

    cy.get("#finishButton").click();

    cy.get(".destructive").should("be.visible");
    cy.get(".destructive").should("contain.text", "Error");
  });
});
