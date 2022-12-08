// imports
import { createMessage, getProfile, getProfileById, getUser, onMessage } from '../fetch-utils.js';
import { renderMessages } from '../render-utils.js';

// get DOM elements
const messageForm = document.querySelector('.message-form');
const messagesContainer = document.querySelector('.messages-container');

const user = getUser();
// events
// add event listener for page load: messages appear
window.addEventListener('load', async () => {
    const profile = getProfile(user.id);

    // error handling
    // if (!id) {
    //     location.assign('/');
    //     return;
    // }
    // call fetchAndDisplayMessages()
    fetchAndDisplayMessages();

    // payload
    onMessage(profile.id, async (payload) => {
        fetchAndDisplayMessages();
    });
});

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
            recipient_id: senderProfile.data.id,
            user_id: user.id,
        });
        // reset form
        messageForm.reset();
    }
});

// display functions

// fetch and display user messages
async function fetchAndDisplayMessages() {
    // clear messages container
    messagesContainer.textContent = '';

    // get profile by user_id
    const profile = await getProfile(user.id);
    console.log('user', user);

    // set the profile object to a variable
    const messagesList = renderMessages(profile);

    // append the profile object variable to the messages container
    messagesContainer.append(messagesList);
}
