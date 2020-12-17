/* eslint-disable quotes */
const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const app = require('../src/app');
const { makeVoyagesArray } = require('./fixtures/voyages.fixtures');
const { makeActivitiesArray } = require('./fixtures/activities.fixtures');

describe('Activities Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE activities RESTART IDENTITY CASCADE'));
  before('clean the table', () => db.raw('TRUNCATE voyages RESTART IDENTITY CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE activities RESTART IDENTITY CASCADE'));
  afterEach('cleanup', () => db.raw('TRUNCATE voyages RESTART IDENTITY CASCADE'));

  beforeEach(`insert voyages`, () => {
    const testVoyages = makeVoyagesArray();
    return db
      .into('voyages')
      .insert(testVoyages);
  });

  describe(`GET /api/activities`, () => {
    context(`Given no activities`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/activities')
          .expect(200, []);
      });
    });

    context(`Given there are activities in the database`, () => {
      const testActivities = makeActivitiesArray();

      beforeEach(`insert activities`, () => {
        return db
          .into('activities')
          .insert(testActivities);
      });

      it(`GET /api/activities responds with 200 and all activities`, () => {
        return supertest(app)
          .get('/api/activities')
          .expect(200, testActivities);
      });
    });
  });

  describe(`GET /api/activities/:activity_id`, () => {
    context(`Given no activity`, () => {
      it(`responds with 404`, () => {
        const activity_id = 123;
        return supertest(app)
          .get(`/api/activities/${activity_id}`)
          .expect(404, { error: { message: `Activity doesn't exist` } });
      });
    });

    context(`Given there are activities in the database`, () => {
      const testActivities = makeActivitiesArray();

      beforeEach('insert activities', () => {
        return db
          .into('activities')
          .insert(testActivities);
      });

      it(`GET /api/activities/:activity_id responds 200 and specified activity`, () => {
        const activity_id = 2;
        const expectedActivity = testActivities[activity_id - 1];
        return supertest(app)
          .get(`/api/activities/${activity_id}`)
          .expect(200, expectedActivity);
      });
    });
  });

  describe(`POST /api/activities`, () => {
    it(`create activity, responds with 201 and new activity`, () => {
      //this.retries(3);
      const newActivity = {
        title: 'Test new activity',
        label: 'Dining',
        content: 'Test content',
        voyage_id: '1',
      };

      return supertest(app)
        .post(`/api/activities`)
        .send(newActivity)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newActivity.title);
          expect(res.body.label).to.eql(newActivity.label);
          expect(res.body.content).to.eql(newActivity.content);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('voyage_id');
          expect(res.headers.location).to.eql(`/api/activities/${res.body.id}`);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.created_ts).toLocaleString();
          expect(actual).to.eql(expected);
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/activities/${postRes.body.id}`)
            .expect(postRes.body) 
        );
    });

    const requiredFields = ['title', 'label', 'content', 'voyage_id'];

    requiredFields.forEach(field => {
      const newActivity = {
        title: 'Test new activity',
        label: 'Dining',
        content: 'Test content',
        voyage_id: '1',
      };

      it(`responds with 400 and error when the '${field}' is missing`, () => {
        delete newActivity[field];

        return supertest(app)
          .post('/api/activities')
          .send(newActivity)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });
  });

  describe(`DELETE /api/activities/:activity_id`, () => {
    context(`Given no activity`, () => {
      it(`responds with 404`, () => {
        const activity_id = 123;

        return supertest(app)
          .delete(`/api/activities/${activity_id}`)
          .expect(404, { error: { message: `Activity doesn't exist` } });
      });
    });

    context(`Given there are activities in the database`, () => {
      const testActivities = makeActivitiesArray();

      beforeEach(`insert activities`, () => {
        return db
          .into('activities')
          .insert(testActivities);
      });

      it(`responds with 204 and removes activity`, () => {
        const idToRemove = 2;
        const expectedActivities = testActivities.filter(activity => activity.id !== idToRemove);

        return supertest(app)
          .delete(`/api/activities/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/activities`)
              .expect(expectedActivities)
          );
      });
    });
  });
});