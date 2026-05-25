Feature: Local documentation

  Background:
    Given the user navigates to the docs page

  Scenario: Displays a correct heading
    Then the heading matching "MAAS documentation" text should exist
