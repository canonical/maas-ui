Feature: Pools list

  Scenario: The correct heading is rendered
    Given the user is logged in
    When the user navigates to the pools page
    Then the pools heading should show machine and pool counts