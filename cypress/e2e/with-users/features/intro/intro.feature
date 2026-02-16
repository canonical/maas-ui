Feature: Intro

Background: 
    Given the user is logged in with intro enabled
    And the user navigates to the home page

Scenario: The intro page is displayed after login
    Then the intro page should be displayed

Scenario: Saving intro setup redirects to images setup
    When the user saves the intro setup
    Then the user should be redirected to the intro images setup

Scenario: The user can skip the initial setup
    When the user skips the initial setup
    Then the user should be redirected to the intro user setup
