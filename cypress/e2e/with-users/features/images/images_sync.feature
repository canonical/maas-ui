Feature: Images sync

  Background:
    Given the user is logged in
    And the user navigates to the images page
    And the page is loaded

  Scenario: The user can add a synced image
    When the user clicks the "Select upstream images" button
    And the "Select upstream images to sync" heading is visible
    And the user expands the "Ubuntu" accordion section
    And the user opens the "22.04" release dropdown
    And the user selects and captures the first available option
    And the user clicks the "Save and sync" button
    Then the selected image row should show "Queueing" in the table

  Scenario: The user can stop and start image syncing
    When the user clicks the "Select upstream images" button
    And the "Select upstream images to sync" heading is visible
    And the user expands the "Ubuntu" accordion section
    And the user opens the "20.04" release dropdown
    And the user selects and captures the first available option
    And the user clicks the "Save and sync" button
    Then the selected image row should show "Queueing" in the table
    And the "Stop synchronization" row action for the selected image row should be enabled
    When the user clicks the "Stop synchronization" row action for the selected image row
    Then the selected image row should show "Waiting for download" in the table
    And the "Start synchronization" row action for the selected image row should be enabled
    When the user clicks the "Start synchronization" row action for the selected image row
    Then the selected image row should show "Queueing" in the table

  Scenario: The user can delete a synced image
    When the user clicks the "Select upstream images" button
    And the "Select upstream images to sync" heading is visible
    And the user expands the "Ubuntu" accordion section
    And the user opens the "20.04" release dropdown
    And the user selects and captures the first available option
    And the user clicks the "Save and sync" button
    Then the selected image row should show "Queueing" in the table
    And the "Stop synchronization" row action for the selected image row should be enabled
    When the user clicks the "Stop synchronization" row action for the selected image row
    Then the selected image row should show "Waiting for download" in the table
    And the "Delete" row action for the selected image row should be enabled
    When the user clicks the "Delete" row action for the selected image row
    And the "Delete image" heading is visible
    And the user clicks the "Delete 1 image" button
    Then the selected image row should not be visible in the table
