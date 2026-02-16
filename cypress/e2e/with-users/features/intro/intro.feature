Feature: Intro

Background: 
    Given the user is logged in before the intro is completed
    And the user navigates to the home page

Scenario: The intro page is displayed after login
    Then the intro page should be displayed

Scenario: Saving MAAS setup redirects to images setup page
    When the user saves the MAAS setup
    Then the user should be redirected to the images setup page

Scenario: The user can skip the initial setup
    When the user skips the initial setup
    Then the user should be redirected to the user setup
