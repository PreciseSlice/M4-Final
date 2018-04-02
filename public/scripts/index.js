const documentWindow = $(window);
const item = $('#item');
const mainForm = $('form');
const cardContainer = $('#card-container');

const getFromServer = async url => {
  try {
    const initialFetch = await fetch(url);

    return await initialFetch.json();
  } catch (error) {
    console.log(error);
  }
};

const postToApi = async (url, data) => {
  try {
    const initialFetch = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteFromApi = async url => {
  try {
    const initialFetch = await fetch(url, {
      method: 'DELETE',
    })
  } catch (error) {
    console.log(error);
  }
}

const patchApi = async (url, data) => {
  try {
    const initialFetch = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.log(error);
  }
} 

const getItems = async () => {
  // fetch items from backend and append to card container
  const items = await getFromServer('/items')

  // look to packed value in data base 
  // if true need to add checked to input

  // need to grab the items from the backend and put them on the DOM

  items.forEach(async storedItems => {
    cardContainer.append(`
      <section class="card">
        <div class="card-top">
          <h2>${ name }</h2>
          <button id="delete-btn">delete</button>
        </div>
        <form id="check-box-form" onsumbmit="checkBoxSubmit">
          <input id="check-box" type="checkbox">
          <label for="check-box">Packed</label>
        </form>
      </section>
    `);
  })
}

const formSubmitHandler = event => {
  event.preventDefault();
  appendCard()
  item.val('')
}

const appendCard = () => {
  // POST item to backend
  const name = item.val();
  const packed = $('#check-box-form').checked
  const data = {
    name: name,
    packed: packed
  } 
  postToApi('/items', data)

  cardContainer.append(`
  <section class="card">
    <div class="card-top">
      <h2>${name}</h2>
      <button id="delete-btn">delete</button>
    </div>
    <form id="check-box-form" onsumbmit="checkBoxSubmit">
      <input id="check-box" type="checkbox">
      <label for="check-box">Packed</label>
    </form>
  </section>
  `);
}

documentWindow.on('load', getItems);
mainForm.on('submit', event => formSubmitHandler(event));

cardContainer.on('click', '#check-box-form', event => {
  event.preventDefault();
  // PATCH item on backend
})

cardContainer.on('click', '#delete-btn', event => {
  // DELETE item from backend
  // need to grab id and assign below
  //id = 
  deleteFromApi(`/items/${id}`)
  event.preventDefault();
  $(event.target).parent().parent().remove()
});
