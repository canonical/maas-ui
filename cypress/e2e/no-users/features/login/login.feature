Feature: Login without users

  Scenario: Shows a create admin message
    Given the user navigates to the home page
    Then the card title should contain "No admin user has been created yet"
