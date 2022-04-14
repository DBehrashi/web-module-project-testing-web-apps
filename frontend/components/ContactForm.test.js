import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

const firstNameInput = () => screen.queryByPlaceholderText(/Edd/i)
const lastNameInput = () => screen.queryByPlaceholderText(/Burke/i)
const emailInput = () => screen.queryByPlaceholderText(/bluebill1049@hotmail.com/i)
const submitBtn = () => screen.queryByText(/Submit/i);


beforeEach(() => {
    render(<ContactForm />)
})

test('renders without errors', () => {
 render(<ContactForm />);
});

test('renders the contact form header', () => {
 const header = screen.queryByText('Contact Form')
 expect(header).toBeInTheDocument();
 expect(header).toBeTruthy();
 expect(header).toHaveTextContent('Contact Form');
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    userEvent.type(firstNameInput(), "qwe");

    const errorMessages = await screen.findAllByTestId('error')
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    userEvent.click(submitBtn());
    const errorMessages = await screen.findAllByTestId('error')
    expect(errorMessages).toHaveLength(3)
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    fireEvent.change(firstNameInput(), { target: { value: 'test'}})
    fireEvent.change(lastNameInput(), { target: { value: 'test'}})
    const errorMessages = await screen.findAllByTestId('error')

    expect(errorMessages).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    fireEvent.change(emailInput(), { target: { value: 'test'}})
    const errorMessage = await screen.findByText(/email must be a valid email address/i)
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    userEvent.click(submitBtn())
    const errorMessage = await screen.findByText(/lastName is a required field/i)
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    
    userEvent.type(firstNameInput(), 'test1')
    userEvent.type(lastNameInput(), 'test2')
    userEvent.type(emailInput(), 'test@test.com')
    userEvent.click(submitBtn())

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText('test1')
        const lastNameDisplay = screen.queryByText('test2')
        const emailDisplay = screen.queryByText('test@test.com')
        const messageDisplay = screen.queryByTestId('messageDisplay')

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
    
});

test('renders all fields text when all fields are submitted.', async () => {

    const messageInput = screen.getByLabelText(/message/i)

    userEvent.type(firstNameInput(), 'test1')
    userEvent.type(lastNameInput(), 'test2')
    userEvent.type(emailInput(), 'test@test.com')
    userEvent.type(messageInput, "test message")
    userEvent.click(submitBtn())

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText('test1')
        const lastNameDisplay = screen.queryByText('test2')
        const emailDisplay = screen.queryByText('test@test.com')
        const messageDisplay = screen.queryByText('test message')

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })

});