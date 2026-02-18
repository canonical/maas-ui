Feature: Login page

Background
    Given the user navigates to the home page
    And the main navigation is expanded

Scenario: An error message is displayed if invalid login credentials are submitted
    When the user enters invalid username and password
    Then the text "Please enter a correct username and password" should be visible

Scenario: The user is logged in and redirected to the intro page if valid username and password are provided
    When the user provides correct username and password
    Then the user is redirected to the maas setup page

Scenario: The user is logged in and redirected to user setup page if the setup intro is skipped
    Given the user sets cookie to skip setup intro
    When the user provides correct username and password
    Then the user is redirected to the user setup page

Scenario: The user is logged in and redirected to the machine list page if setup and user intros are skipped
    Given the user sets cookies to skip setup and user intros
    When the user provides correct username and password
    Then the user is redirected to the machines list page