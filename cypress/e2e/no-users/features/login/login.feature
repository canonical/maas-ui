Feature: Login without users

  Scenario: Shows a create admin message
    Given the user navigates to the home page
    Then the heading matching "No admin user has been created yet" text should exist
