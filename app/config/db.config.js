module.exports = {
  host: 'localhost',
  port: 3306,
  database: 'tryit',
  username: 'express',
  password: 'mypass',
  logging: console.log,
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/var/run/mysqld/mysqld.sock',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
};
