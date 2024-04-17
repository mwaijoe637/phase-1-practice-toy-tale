let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys(); // Fetch Andy's toys when the page loads

  // Event listener for submitting the toy form
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', addNewToy);

  // Event listener for clicking the like button
  toyCollection.addEventListener('click', (event) => {
    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.getAttribute('id');
      increaseLikes(toyId);
    }
  });
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      console.log('Toys:', toys); // Log fetched toy data
      toys.forEach(toy => renderToy(toy));
    })
    .catch(error => console.error('Error fetching toys:', error));
}

function renderToy(toy) {
  const toyCollection = document.querySelector('#toy-collection');

  const card = document.createElement('div');
  card.classList.add('card');

  const name = document.createElement('h2');
  name.textContent = toy.name;

  const image = document.createElement('img');
  image.src = toy.image;
  image.classList.add('toy-avatar');

  const likes = document.createElement('p');
  likes.textContent = `${toy.likes} Likes`;

  const likeBtn = document.createElement('button');
  likeBtn.textContent = 'Like ❤️';
  likeBtn.classList.add('like-btn');
  likeBtn.setAttribute('id', toy.id);

  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);
  card.appendChild(likeBtn);

  toyCollection.appendChild(card);
}

function addNewToy(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const image = event.target.image.value;
  const likes = 0;

  const newToy = {
    name,
    image,
    likes
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(toy => renderToy(toy))
  .catch(error => console.error('Error adding new toy:', error));

  event.target.reset();
}

function increaseLikes(toyId) {
  fetch(`http://localhost:3000/toys/${toyId}`)
    .then(response => response.json())
    .then(toy => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        const toyCard = document.getElementById(toyId);
        const likes = toyCard.querySelector('p');
        likes.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error increasing likes:', error));
    })
    .catch(error => console.error('Error fetching toy:', error));
}
