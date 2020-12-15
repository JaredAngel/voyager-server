const ActivitiesService = {
  getAllActivities(db) {
    return db('activities')
      .select('*');
  },

  insertActivity(db, data) {
    return db('activities')
      .insert(data)
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(db, id) {
    return db('activities')
      .select('*')
      .where({ id })
      .first();
  },

  deleteActivity(db, id) {
    return db('activities')
      .where({ id })
      .delete();
  },

  updateActivity(db, id, data) {
    return db('activities')
      .where({ id })
      .update(data);
  }

};

module.exports = ActivitiesService;