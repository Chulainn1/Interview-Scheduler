
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

    // debug(day);
    // console.log(prettyDOM(appointment));
  });

});
    