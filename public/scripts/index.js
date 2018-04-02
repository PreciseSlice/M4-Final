const documentWindow = $(window);
const item = $('#item');
const mainForm = $('form');
const cardContainer = $('#card-container');

const getItems = () => {
  // fetch items from backend and append to card container
}

const formSubmitHandler = event => {
  event.preventDefault();
  appendCard()
  item.val('')
}

const appendCard = () => {
  // POST item to backend

  cardContainer.append(`
  <section class="card">
    <div class="card-top">
      <h2>${item.val()}</h2>
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

  event.preventDefault();
  $(event.target).parent().parent().remove()
});
