function getImages() {
    fetch("http://localhost:3000/images")
        .then((response) => response.json())
        .then((images) => {
            // const imageContainer = document.getElementById('image-container');
            const imageContainer = document.createElement("div");
            imageContainer.setAttribute("id", "image-container");
            images.forEach((image) => {
                const img = document.createElement("img");
                img.src = `http://localhost:3000/images/${image}`;
                imageContainer.appendChild(img);
            });
            document.body.appendChild(imageContainer);
        });
}


const getData = async () => {
    const response = await fetch("http://localhost:3000/retrieve-data");
    const data = await response.json();
    data.forEach(user => {
        /* ------------------------- Inserting user details ------------------------- */
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.innerHTML = `
            <div class="user__name">Name - ${`${user.firstName} ${user.lastName} `}</div>
            <div class="user__email">Email - ${user.email}</div>
            <div class="user__invite">Invite Code - ${user.testInvitation}</div>
        `;
        document.querySelector('.container').appendChild(userDiv);
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        
        /* ---------------------------- Inserting images ---------------------------- */
        user.images.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            const img = document.createElement('img');
            const title = document.createElement('span');
            title.classList.add('span');
            title.innerHTML = image.id;
            img.src = image.url;
            card.appendChild(img);
            card.appendChild(title);
            wrapper.appendChild(card);
        });

        /* ------------------------ When there are no images ------------------------ */
        if(user.images.length === 0){
        
            wrapper.innerHTML = `<p class='warn'> No images uploaded yet! </p>`;
        }
        
        document.querySelector('.container').appendChild(wrapper);

    })
}

document.querySelector('button').addEventListener('click', e => {
    e.preventDefault();
    const val = document.querySelector('input').value;
    console.log(val)

    fetch(`http://localhost:3000/set_interval?interval=${val}`)
    .then( _ => {
        document.querySelector('.span_int').innerText = 'Interval set!';
        setTimeout(() => document.querySelector('.span_int').innerText = 'Set the interval of the frames (in minutes).', 3000);
    });
});


getData();
getImages();
