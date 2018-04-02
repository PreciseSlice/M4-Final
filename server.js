const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));

app.locals.title = 'Mod-4-final';

app.get('/items', (request, response) => {
  database('items')
    .select()
    .then(items => {
      if (items.length) {
        response.status(200).json(items);
      } else {
        response.status(404).json({
          error: 'item not found'
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/items', (request, response) => {
  const item = request.body;

  for (let requiredParameter of ['name', 'packed']) {
    if (!item[requiredParameter]) {
      return response.status(422).send({
        error: `you are missing ${requiredParameter} property`
      });
    }
  }

  database('items')
    .insert(item, 'id')
    .then(item => {
      response.status(201).json({ id: item[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/items/:id', (request, response) => {
  const item = request.body;
  const { name, packed } = request.body;

  for (let requiredParameter of ['name', 'packed']) {
    if (!item[requiredParameter]) {
      return response.status(422).send({
        error: `you are missing ${requiredParameter} property`
      });
    }
  }

  database('items')
    .where('id', request.params.id)
    .select()
    .update({
      name: name,
      packed: packed
    })
    .then(item => {
      response.status(201).json({ item });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/items/:id', (request, response) => {
  database('items')
    .where('id', request.params.id)
    .select()
    .del()
    .then(item => {
      if (item) {
        response.status(202).json(item);
      } else {
        return response.status(422).send({
          error: 'Incorrect item ID provided'
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server is running on ${app.get('port')}.`);
});

module.exports = app;
