function makeVoyagesArray() {
  return [
    {
      id: 1,
      title: 'First Voyage',
      created_ts: '2029-01-22T16:28:32.615Z',
      author_id: 1
    },
    {
      id: 2,
      title: 'Second Voyage',
      created_ts: '2029-01-22T16:28:32.615Z',
      author_id: 1
    },
    {
      id: 3,
      title: 'Third Voyage',
      created_ts: '2029-01-22T16:28:32.615Z',
      author_id: 2
    },
    {
      id: 4,
      title: 'Fourth Voyage',
      created_ts: '2029-01-22T16:28:32.615Z',
      author_id: 2
    },
  ];
}

module.exports = {
  makeVoyagesArray,
};