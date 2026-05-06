Feature: Images sync

  Background:
    Given the user is logged in
    And the user navigates to the images page
    And the page is loaded

  Scenario: The user can add, manage, and delete a synced image
    # Add the image
    When the user clicks the "Select upstream images" button
    And the "Select upstream images to sync" heading is visible
    And the user expands the "Ubuntu" accordion section
    And the user opens the dropdown for "22.04"
    And the user selects "s390x"
    And the user clicks the "Save and sync" button

    # Stop the download
    Then a row matching "22.04 s390x Queueing" should be visible in the table
    And the "Stop synchronization" row action for the "22.04 s390x" row should be enabled
    When the user clicks the "Stop synchronization" row action for the "22.04 s390x" row
    Then a row matching "22.04 s390x Waiting for download" should be visible in the table

    # Start the download again
    And the "Start synchronization" row action for the "22.04 s390x" row should be enabled
    When the user clicks the "Start synchronization" row action for the "22.04 s390x" row
    Then a row matching "22.04 s390x Queueing" should be visible in the table

    # Stop again before deleting
    And the "Stop synchronization" row action for the "22.04 s390x" row should be enabled
    When the user clicks the "Stop synchronization" row action for the "22.04 s390x" row
    Then a row matching "22.04 s390x Waiting for download" should be visible in the table

    # Delete the image
    And the "Delete" row action for the "22.04 s390x" row should be enabled
    When the user clicks the "Delete" row action for the "22.04 s390x" row
    And the "Delete image" heading is visible
    And the user clicks the "Delete 1 image" button
    Then a row matching "22.04 s390x" should not be visible in the table
