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

app.get('/items', (request, responce) => {
  database('items')
    .select()
    .then(items => {
      if (items.length) {
        responce.status(200).json(items);
      } else {
        responce.status(404).json({
          error: 'item not found'
        });
      }
    })
    .catch(error => {
      responce.status(500).json({ error });
    });
});

app.post('/items', (request, responce) => {
  const item = request.body;

  for (let requiredParameter of ['name', 'packed']) {
    if (!item[requiredParameter]) {
      return responce.status(422).send({
        error: `you are missing ${requiredParameter} property`
      });
    }
  }

  database('items')
    .insert(item, 'id')
    .then(item => {
      responce.status(201).json({ id: item[0] });
    })
    .catch(error => {
      responce.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server is running on ${app.get('port')}.`);
});



module.exports = app;
