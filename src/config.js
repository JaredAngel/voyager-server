module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || '62726ad8-23cd-11eb-adc1-0242ac120002',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://voyager_admin@localhost/voyager',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://voyager_admin@localhost/voyager-test'
};