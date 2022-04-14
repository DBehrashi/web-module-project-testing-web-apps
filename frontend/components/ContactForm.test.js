import React from 'react';
import { findAllByAltText, findAllByTestId, fireEvent, getByText, queryAllByTestId, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

const firstNameInput = ()=>screen.getByPlaceholderText('Bobby')
const lastNameInput = ()=>screen.getByPlaceholderText('Hummer')
const emailInput = ()=>screen.getByPlaceholderText('sobersally@gmail.com')
const submitButton = () => screen.getByRole('button')
beforeEach(()=>{
    render(<ContactForm/>)
})

test('renders without errors', () => {
    render(<ContactForm/>)
});

test('renders the contact form header', () => {
    screen.getByText('Contact Form')
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    fireEvent.change(firstNameInput(),{target:{value:'a'}})
    screen.getByTestId('error')
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    userEvent.type(firstNameInput(),'a')
    userEvent.type(lastNameInput(),'a')
    userEvent.type(emailInput(),'a')
    // screen.debug()
    userEvent.clear(firstNameInput())
    userEvent.clear(lastNameInput())
    userEvent.clear(emailInput())
    const errors = screen.queryAllByTestId('error')
    expect(errors).toHaveLength(3)
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    userEvent.type(firstNameInput(),'dari')
    userEvent.type(lastNameInput(),"Behrashi")
    userEvent.type(emailInput(),"oooglaboogla")
    userEvent.clear(emailInput())
    screen.getByTestId('error') 
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    userEvent.type(emailInput(),'nonEmail.com')
    const emailError = screen.findByText("email must be a valid email address")
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {    
    userEvent.click(submitButton())
    const emailError = screen.findByText("lastName is a required field")
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    userEvent.type(firstNameInput(),'Dari')
    userEvent.type(lastNameInput(),"Behrashi")
    userEvent.type(emailInput(),"dari.behrashi@gmail.com")
    userEvent.click(submitButton())
    const f = screen.getByText("dari")
    const s = screen.getByText("Behrashi")
    const e = screen.getByText("dari.behrashi@gmail.com")
    expect(screen.queryByText('message')).not.toBeInTheDocument()
});

test('renders all fields text when all fields are submitted.', async () => {
    userEvent.type(firstNameInput(),'dari')
    userEvent.type(lastNameInput(),"behrashi")
    userEvent.type(emailInput(),"dari.behrashi@gmail.com")
    userEvent.type(screen.getByLabelText('Message'),'Test message')
    userEvent.click(submitButton())
    screen.getByText("dari")
    screen.getByText("behrashi")
    screen.getByText("dari.behrashi@gmail.com")
    screen.getByText('Test message')
    expect(screen.queryByText('Message')).toBeInTheDocument()
    
});