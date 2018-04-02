const item = $('#item');
const mainForm = $('form');
const cardContainer = $('#card-container');

const formSubmitHandler = event => {
  event.preventDefault();
  appendCard()
  item.val('')
}

const appendCard = () => {
  cardContainer.append(`
  <section class="card">
    <div>
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

mainForm.on('submit', event => formSubmitHandler(event));

cardContainer.on('click', '#delete-btn', event => { 
  event.preventDefault();
  $(event.target).parent().parent().remove()
});
