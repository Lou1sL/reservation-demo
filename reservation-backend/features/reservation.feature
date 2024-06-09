
Feature: Reservation Management

  Scenario: Employee views reservations
    Given I am logged in as an employee
    When I request a list of reservations
    Then I should see all reservations

  Scenario: Guest creates a reservation
    Given I am a guest
    When I create a reservation
    Then the reservation should be created under my name

  Scenario: Guest cancels their reservation
    Given I am a guest
    And I have a reservation
    When I cancel my reservation
    Then the reservation should be marked as cancelled

  Scenario: Guest tries to cancel another guest's reservation
    Given I am a guest
    When I try to cancel another guest's reservation
    Then I should receive an unauthorized error
