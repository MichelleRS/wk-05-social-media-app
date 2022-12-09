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

    const data = new FormData(messageForm);
    const user = getUser();
    const senderProfile = await getProfile(user.id);

    if (!senderProfile) {
        alert('You must make your profile before you can send messages!');
        location.assign('/');
    } else {
        await createMessage({
            text: data.get('message'),
            sender: senderProfile.data.username,
            recipient_id: id,
            user_id: user.id,
        });

        messageForm.reset();
    }
    await fetchAndDisplayProfile();
});

// get profile
async function fetchAndDisplayProfile() {
    profileDetailEl.textContent = '';

    const profile = await getProfileById(id);
    console.log('profile', profile);
    imgEl.src = profile.avatar_url;

    usernameHeaderEl.textContent = profile.username;
    profileDetailEl.textContent = profile.bio;

    const profileStars = renderStars(profile);
    const messagesList = renderMessages(profile);

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
