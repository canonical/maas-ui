Feature: Reserved IP for machine

Background:
    Given the user is logged in
    And the user navigates to the networks by fabric page
    And the "Subnets by fabric" table has loaded
    And the viewport is "macbook-11"

Scenario: The user can reserve, edit and delete a static DHCP lease on a subnet
    When the user opens the first subnet
    And the user navigates to the address reservation tab
    And the user reserves a static DHCP lease
    Then the new static DHCP lease appears in the table
    When the user edits the static DHCP lease comment
    Then the updated comment is visible in the static DHCP leases table
    When the user deletes the static DHCP lease
    Then the static DHCP lease should not exist

Scenario: A reserved IP is linked to a machine when the machine's MAC address is used
    Given the user has created a machine with a known MAC address
    And the user navigates to the networks by fabric page
    When the user opens the first subnet
    And the user navigates to the address reservation tab
    And the user reserves a static DHCP lease for the machine
    Then the machine is linked to the static DHCP lease in the table
