module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || '62726ad8-23cd-11eb-adc1-0242ac120002',
  DB_URL: process.env.DB_URL || 'postgresql://voyager_admin@localhost/voyager',
};