// imports
import { createMessage, getProfile, getUser } from '../fetch-utils.js';

// get DOM elements
const messageForm = document.querySelector('.message-form');

const params = new URLSearchParams(location.search);
const id = params.get('id');

// events

// event listener for form submit button
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get form input values
    const data = new FormData(messageForm);

    // check for a user
    const user = getUser();

    // pass the user.id into getProfile to check if there is an associated profile
    const senderProfile = await getProfile(user.id);

    // if/else statement for handling user check
    // if not a user
    if (!senderProfile) {
        // send an alert and redirect the user
        alert('You must create an account before you can submit a message in the chat room');
        location.assign('/');
        // if user, then send their message to Supabase
    } else {
        await createMessage({
            text: data.get('message'),
            sender: senderProfile.data.username,
            recipient_id: id,
            user_id: user.id,
        });
        // reset form
        messageForm.reset();
    }
});

// display functions
