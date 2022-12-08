// imports
import {
    getUser,
    getProfile,
    decrementStars,
    getProfileById,
    incrementStars,
    createMessage,
} from '../fetch-utils.js';
import { renderMessages } from '../render-utils.js';

// get DOM elements
const imgEl = document.querySelector('#avatar-img');
const usernameHeaderEl = document.querySelector('.username-header');
const profileDetailEl = document.querySelector('.profile-detail');
const messageForm = document.querySelector('.message-form');

const params = new URLSearchParams(location.search);
const id = params.get('id');
// events

// display functions
window.addEventListener('load', async () => {
    // error handling
    // no id found? redirect back to main page
    // don't run the rest of the code in function
    if (!id) {
        location.assign('/');
        return;
    }
    fetchAndDisplayProfile();
});

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get form input values
    const data = new FormData(messageForm);

    // check that sender user has profile info
    const user = getUser();
    const senderProfile = await getProfile(user.id);

    if (!senderProfile) {
        // if not a user, send alert and redirect
        alert('You must create an account before you can send a private message');
        location.assign('/');
    } else {
        // send message to Supabase
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
// get profile
async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';

    const profile = await getProfileById(id);
    console.log('profile', profile);
    imgEl.src = profile.avatar_url;

    usernameHeaderEl.textContent = profile.username;
    profileDetailEl.textContent = profile.bio;

    // render stars
    const profileStars = renderStars(profile);

    // render messages
    const messagesList = renderMessages(profile);

    // append stars and messages to profile detail container
    profileDetailEl.append(profileStars, messagesList);
}

// render stars
function renderStars({ stars, username, id }) {
    const p = document.createElement('p');
    const downButton = document.createElement('button');
    const upButton = document.createElement('button');

    const profileStars = document.createElement('div');

    profileStars.classList.add('profile-stars');
    profileStars.append(p, upButton, downButton);

    downButton.textContent = 'downvote user ⬇️';
    upButton.textContent = 'upvote user ⬆️';
    p.classList.add('profile-name');

    p.textContent = `${username} has ${stars} ⭐`;

    // add click event listener to each button
    downButton.addEventListener('click', async () => {
        await decrementStars(id);
        await fetchAndDisplayProfile();
    });

    upButton.addEventListener('click', async () => {
        await incrementStars(id);
        await fetchAndDisplayProfile();
    });

    return profileStars;
}
