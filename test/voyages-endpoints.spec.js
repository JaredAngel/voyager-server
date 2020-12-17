/* eslint-disable quotes */
const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const app = require('../src/app');
const { makeVoyagesArray } = require('./fixtures/voyages.fixtures');

describe('Voyages Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE voyages RESTART IDENTITY CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE voyages RESTART IDENTITY CASCADE'));

  describe(`GET /api/voyages`, () => {
    context(`Given no voyages`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/voyages')
          .expect(200, []);
      });
    });

    context(`Given there are voyages in the database`, () => {
      const testVoyages = makeVoyagesArray();

      beforeEach('insert voyages', () => {
        return db
          .into('voyages')
          .insert(testVoyages);
      });

      it('GET /api/voyages responds with 200 and all voyages', () => {
        return supertest(app)
          .get('/api/voyages')
          .expect(200, testVoyages);
      });
    });
  });

  describe(`GET /api/voyages/:voyage_id`, () => {
    context(`Given no voyages`, () => {
      it(`responds with 404`, () => {
        const voyage_id = 123;
        return supertest(app)
          .get(`/api/voyages/${voyage_id}`)
          .expect(404, { error: { message: `Voyage doesn't exist` } });
      });
    });

    context(`Given there are voyages in the database`, () => {
      const testVoyages = makeVoyagesArray();

      beforeEach('insert voyages', () => {
        return db
          .into('voyages')
          .insert(testVoyages);
      });

      it(`GET /api/voyages/:voyage_id responds 200 and specified voyage`, () => {
        const voyage_id = 2;
        const expectedVoyage = testVoyages[voyage_id - 1];
        return supertest(app)
          .get(`/api/voyages/${voyage_id}`)
          .expect(200, expectedVoyage);
      });
    });
  });

  describe(`POST /api/voyages`, () => {
    it(`create voyage, responds with 201 and new voyage`, () => {
      //this.retries(3);
      const newVoyage = {
        title: 'Test new voyage',
      };

      return supertest(app)
        .post(`/api/voyages`)
        .send(newVoyage)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newVoyage.title);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/voyages/${res.body.id}`);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.created_ts).toLocaleString();
          expect(actual).to.eql(expected);
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/voyages/${postRes.body.id}`)
            .expect(postRes.body) 
        );
    });

    const requiredFields = ['title'];

    requiredFields.forEach(field => {
      const newVoyage = {
        title: 'Test new voyage',
      };

      it(`responds with 400 and error when the '${field}' is missing`, () => {
        delete newVoyage[field];

        return supertest(app)
          .post('/api/voyages')
          .send(newVoyage)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });
  });

  describe(`DELETE /api/voyages/:voyage_id`, () => {
    context(`Given no voyage`, () => {
      it(`responds with 404`, () => {
        const voyage_id = 123;

        return supertest(app)
          .delete(`/api/voyages/${voyage_id}`)
          .expect(404, { error: { message: `Voyage doesn't exist` } });
      });
    });

    context(`Given there are voyages in the database`, () => {
      const testVoyages = makeVoyagesArray();

      beforeEach(`insert voyages`, () => {
        return db
          .into('voyages')
          .insert(testVoyages);
      });

      it(`responds with 204 and removes voyage`, () => {
        const idToRemove = 2;
        const expectedVoyages = testVoyages.filter(voyage => voyage.id !== idToRemove);

        return supertest(app)
          .delete(`/api/voyages/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/voyages`)
              .expect(expectedVoyages)
          );
      });
    });
  });
});