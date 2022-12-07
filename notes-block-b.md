# Week 05, Block B: Real Time

Realtime
If two people are looking at the same profile page, and one sends a message to the profile, both will see it show up on the page at the same time. No need to refresh

---

Part B

-   working on the /profile page

### HTML

-   form for message input (with label and button)

### Events

-   on page load, add subscribing for realtime updates on CREATE of message
-   form submit
    -   get user's form input values
    -   check sender user has profile info
    -   send message to Supabase
    -   reset form
    -   (before we implement realtime) call our fetchAndDisplay

### Functions

-   createMessage
-   onMessage (for realtime)

## Slices

-   'messages' table in Supabase with:
    -   id, created_at, text, sender, recipient_id(link to profile.id), user_id
-   create Message functionality
-   implement realtime updates

---

## Supabase

text
sender (same as from_email)

recipient_id:
public - profiles

user_id:
auth? - users

### Policies for Messages Table

Who? What do you want them to be able to do?

-   We want to allow a logged in user (authorized user) to create a message

    -   Authenticated users -> INSERT

-   For anyone who is logged in, they can see the messages
    -   auth -> select/READ

---

## profile/index.html

---

## fetch-utils

```
// create message function

export async function createMessage(message) {
    const response = await client.from('messages').insert(message).single();
    return checkError(response);
}

```

## profile.js

```
// get DOM elements
const messageForm = document...


messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get the user's form input value
    const data = new FormData(messageForm);

    // check sender user has profile info
    // call getUser to grab the user object of the currently logged in user
    const user = getUser();
    console.log('user', user);
    // passing the user.id into getProfile to check if there is an associated profile
    const senderProfile = await getProfile(user.id);
    // if there's not a profile associated with the logged in user...
    if (!senderProfile) {
        // send an alert and redirect the user
        alert('You must make your profile before you can message anyone');
        // after alert ok is clicked, take them back to home page
        location.assign('/');
    } else {
        // if there IS a profile for the logged in user in our profiles table, then...
        // send message to Supabase
        await createMessage({
            // text value is coming from form data
            text: data.get('message'),
            // sender value is taking the logged in user and looking at the data.username on it
            // more specific because fetch function gets all
            sender: senderProfile.data.username,
            // recp id value is coming from url search params
            recipient_id: id,
            // user id is coming from our getUser function - the logged in user
            user_id: user.id
        })
        // reset form
        messageForm.reset();
    }
    // (before we implement realtime) call our fetchAndDisplay function
    await fetchAndDisplayProfile()
});

```

---

## render-utils

renderMessages(profile)

Notes about the render function:

-   Creating our ul, header
-   setting text content and adding class
-   we're looking at the profile messages (which comes back as an array)
-   for loop:
    -   written differently to see another way to write a for loop for more precision
        -   same as for (let message of profile.messages)
    -   i = index
    -   i < profile.message.length:
        -   looks at length of of the array
        -   when you get to the end of this array, stop
    -   3 parts to this type of loop:
        (1) initialization (let i = 0); (2) condition (i < profile.messages.length); (3) increment/decrement
-   created_at time to make an actual date using toLocaleString():
    -   it takes in two values: (1) 'en-US' (english, we're in the US), (2) key value pairs so it knows what to do with all the numbers
    -   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString

---

## profile.js

Update the fetchAndDisplayProfile() function

```
async function fetchAndDisplayProfile() {
    ...

    // NEW ADDITION UNDER const profileStars
    const messageLists = renderMessages(profile);

    // NEW ADDITION - append messageLists to the profileDetailEl
    profileDetailEl.append(profileStars, messageLists);
}

```

---

## fetch-utils

OOPS - need to update getProfileById(id)

change select('_') to: ('_), message(\*)")

---

## real time

In Supabase, enable real time

Docs: https://supabase.com/docs/reference/javascript/v1/subscribe
Be sure you are on v1

-   listening to a specific table(target the table)
-   listening to profile page (what we want it to happen on)

---

## fetch-utils

this is technically an event (happens on a button click), so it doesn't need to be async

```
// ADD BELOW createMessage(message)
export function onMessage(profileId, handleMessage) {
    client
    // what table and what rows are we interested in?
    // we only want to see the rows associated with that profileId - will work without, but a heavier data load
    .from(`messages: recipient_id=eq.${profileId}`)
    // what type of changes are we interested in?
    .on('INSERT', handleMessage),
    // okay, do it!
    .subscribe();
}

```

## profile.js

ADDITION TO load event listener
_Things were breaking for a bit_

```
// ADD BELOW fetchAndDisplayProfile()
onMessage(async (payload) => {
    console.log('payload',payload);
    fetchAndDisplayProfile();
});


```

Can build a new page - Chat Room

Need one more CRUD route - can update and not create if you want, let TA know

---

## How to Fork

-   Go to GitHub repo
-   Fork -> create new fork
-   claim ownership
-   uncheck copy the `main` branch
-   create fork

---

Due? Friday morning
