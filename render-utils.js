export function renderProfile(profileObject) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const a = document.createElement('a');

    div.classList.add('profile-list-item');
    img.classList.add('avatar');
    a.classList.add('profile-link');

    img.src = profileObject.avatar_url;
    img.alt = 'avatar';
    p.textContent = `⭐️${profileObject.stars}`;
    a.textContent = `${profileObject.username}`;
    a.href = `../profile/?id=${profileObject.id}`;

    div.append(img, a, p);
    return div;
}

// render messages for chat room
export function renderMessages(profile) {
    // create list container for messages
    const ulContainer = document.createElement('ul');

    // for loop for each message
    for (let i = 0; i < profile.messages.length; i++) {
        // li container for each message
        const liContainer = document.createElement('li');

        // create a p element to display message ('text')
        const textEl = document.createElement('p');
        textEl.textContent = profile.messages[i].text;

        // create a p element to display user ('sender')
        const senderEl = document.createElement('p');
        senderEl.textContent = `Posted by ${profile.messages[i].sender}.`;

        // create a p element to display date info ('created_at')
        const dateEl = document.createElement('p');
        dateEl.textContent = new Date(profile.messages[i].create_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        // append
        liContainer.append(textEl, senderEl, dateEl);
        ulContainer.append(liContainer);

        // return
        return ulContainer;
    }
}
