const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API routes', () => {
  beforeEach(done => {
    database.migrate.rollback().then(() => {
      database.migrate.latest().then(() => {
        return database.seed.run().then(() => {
          done();
        });
      });
    });
  });

  it('should return the homepage with text', () => {
    return chai
      .request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
      });
  });

  it('if the route does not exist a 404 should be returned', () => {
    return chai
      .request(server)
      .get('/spaceship')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });

  describe('GET /items', () => {
    it('should return all the items', () => {
      return chai
        .request(server)
        .get('/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('first item');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('POST /items', () => {
    it('should create a new item', () => {
      return chai
        .request(server)
        .post('/items')
        .send({
          name: 'flashlight',
          packed: 'false'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.id.should.equal(3);
        })
        .catch(err => {
          throw err;
        });
    });

    it('should not create an item with missing data', () => {
      return chai
        .request(server)
        .post('/items')
        .send({
          name: 'flashlight'
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal('you are missing packed property');
        });
    });
  });

  describe('PATCH /items/:id', () => {
    
    it('should update the item', () => {
      return chai
        .request(server)
        .patch('/items/1')
        .send({
          name: 'flashlight',
          packed: 'false'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.item.should.equal(1);
        });
    });

    it('should not update an item with missing data', () => {
      return chai
        .request(server)
        .patch('/items/1')
        .send({
          name: 'flashlight'
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal(
            'you are missing packed property'
          );
        });
    });

  });

  describe('DELETE /items/:id', () => {

    it('should delete a specific item', () => {
      return chai
        .request(server)
        .delete('/items/1')
        .then(response => {
          response.should.have.status(202);
          response.body.should.equal(1);
        });
    });

    it('should return 422 if item id does not exist', () => {
      return chai
        .request(server)
        .delete('/items/16')
        .then(response => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          response.body.error.should.equal('Incorrect item ID provided');
        });
    });
  })

});
