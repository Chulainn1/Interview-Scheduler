import axios from "axios";
/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";
/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { 
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  getByText, 
  prettyDOM, 
  getAllByTestId, 
  getByAltText,
  getByPlaceholderText, 
  queryByText} from "@testing-library/react";
/*
  We import the component that we are testing
*/
import Application from "components/Application";
/*
  A test that renders a React Component
*/
afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const {getByText} = render(<Application />);

  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));

  expect(getByText("Leopold Silvers")).toBeInTheDocument();
  
});

// -------------------------------------------------------------------------//

describe("Application", () => {

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const {container, debug} = render(<Application/>);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));


    expect(getByText(appointment, "Saving")).toBeInTheDocument();


    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));


    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

 
  });

// -------------------------------------------------------------------------//

  it("loads data, cancels an interview and increases the spots remaining for the Monday by 1", async () => {

  // 1. Render the Application.

    const {container, debug} = render(<Application/>);

  // 2. Wait until the text "Archie Cohen" is displayed.

    await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Delete" button on the booked appointment.

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )
    
    fireEvent.click(getByAltText(appointment, "Delete"));

  // 4. Check that the confirmation message is shown.

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

  // 5. Click the "Confirm" button on the confirmation.

    fireEvent.click(getByText(appointment, "Confirm"));

  // 6. Check that the element with the text "Deleting" is displayed.

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

  // 7. Wait until the element with the "Add" button is displayed.

    await waitForElement(() => getByAltText(appointment, "Add"));

  // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  // -------------------------------------------------------------------------//

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const {container, debug} = render(<Application/>);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"))
    // 3. Click the "Edit" button
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )
    
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Change the students name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click Save button
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that element with "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 7. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    // debug(container)
  })

// -------------------------------------------------------------------------//

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const {container, debug} = render(<Application/>);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));


    expect(getByText(appointment, "Saving")).toBeInTheDocument();


    await waitForElement(() => getByText(appointment, "Unable to save."));


    expect(getByText(appointment, "Unable to save.")).toBeInTheDocument();
    
    // debug(appointment)
  });

// -------------------------------------------------------------------------//

  it("shows the delete error when failing to delete an existing appointment", async () => {
    
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect( getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the text "Could not cancel appointment. Please try again in a few minutes." error message is displayed.

    await waitForElement(() => getByText(appointment, "Could not cancel appointment."));
    
    // expect(getByText(appointment, "Could not cancel appointment. Please try again in a few minutes.")).toBeInTheDocument();

    debug(appointment);

  });
});
    