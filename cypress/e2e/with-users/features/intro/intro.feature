Feature: Intro

  Background:
    Given the user is logged in before the intro is completed
    And the user navigates to the home page

  Scenario: The intro page is displayed after login
    Then the intro page should be displayed

  Scenario: Saving MAAS setup redirects to images setup page
    When the user saves the MAAS setup
    Then the user should be redirected to the images setup page
    When the user clicks the "Select upstream images" button
    And the "Select upstream images to sync" heading is visible
    And the user expands the "Ubuntu" accordion section
    And the user opens the dropdown for "22.04"
    And the user selects "s390x"
    And the user clicks the "Save and sync" button

    Then a row matching "22.04 s390x Queueing" should be visible in the table
    And the "Continue" button should be enabled

    And the "Stop synchronization" row action for the "22.04 s390x" row should be enabled
    When the user clicks the "Stop synchronization" row action for the "22.04 s390x" row
    Then a row matching "22.04 s390x Waiting for download" should be visible in the table

    And the "Delete" row action for the "22.04 s390x" row should be enabled
    When the user clicks the "Delete" row action for the "22.04 s390x" row
    And the "Delete image" heading is visible
    And the user clicks the "Delete 1 image" button
    Then a row matching "22.04 s390x" should not be visible in the table

  Scenario: The user can skip the initial setup
    When the user skips the initial setup
    Then the user should be redirected to the user setup page
