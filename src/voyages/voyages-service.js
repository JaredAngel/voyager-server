const VoyagesService = {
  getAllVoyages(db) {
    return db('voyages')
      .select('*');
  },

  insertVoyage(db, data) {
    return db('voyages')
      .insert(data)
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(db, id) {
    return db('voyages')
      .select('*')
      .where({ id })
      .first();
  },

  deleteVoyage(db, id) {
    return db('voyages')
      .where({ id })
      .delete();
  },

  updateVoyage(db, id, data) {
    return db('voyages')
      .where({ id })
      .update(data);
  }

};

module.exports = VoyagesService;