$('document').ready(() => {
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

      return await initialFetch.json();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFromApi = async url => {
    try {
      const initialFetch = await fetch(url, {
        method: 'DELETE'
      });
    } catch (error) {
      console.log(error);
    }
  };

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
  };

  const renderCard = (id, name, check) => {
    cardContainer.append(`
      <article class="card" data-id="${id}" data-name="${name}">
        <div class="card-top">
          <h2>${name}</h2>
          <button id="delete-btn">delete</button>
        </div>
        <form id="check-box-form">
          <input data-name="${name}" data-id="${id}" class="check-boxes" id="check-${id}" type="checkbox" ${check}>
          <label for="check-${id}">Packed</label>
        </form>
      </article>
    `);
  };

  const getItems = async () => {
    const items = await getFromServer('/items');

    if (items) {
      items.forEach(async item => {
        const id = item.id;
        const name = item.name;
        const check = item.packed ? 'checked' : '';

        renderCard(id, name, check);
      });
    }
  };

  const formSubmitHandler = event => {
    event.preventDefault();
    appendCard();
    item.val('');
  };

  const appendCard = async () => {
    const name = item.val();
    const data = {
      name: name,
      packed: false
    };

    const id = await postToApi('/items', data);

    renderCard(id, name, false);
  };

  documentWindow.on('load', getItems);

  mainForm.on('submit', event => formSubmitHandler(event));

  cardContainer.on('click', '.check-boxes', event => {
    const currentItem = $(event.target);
    const checkedProperty = event.target.checked;

    const data = {
      name: currentItem[0].dataset.name,
      packed: checkedProperty
    };

    patchApi(`/items/${currentItem[0].dataset.id}`, data);
  });

  cardContainer.on('click', '#delete-btn', event => {
    event.preventDefault();
    $('#delete-btn').attr('disabled', true);
    const item = $(event.target)
      .parent()
      .parent();

    item.remove();
    deleteFromApi(`/items/${item[0].dataset.id}`);
  });
});
