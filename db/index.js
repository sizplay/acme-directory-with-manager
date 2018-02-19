const conn = require('./conn');
const Employee = require('./Employee');

const sync = () => {
  return conn.sync({ force: true });
};

const seed = () => {
  return Promise.all([
    Employee.create({ email: 'test@gmail.com' }),
    Employee.create({ email: 'sungae@gmail.com' }),
    Employee.create({ email: 'sizplay@gmail.com' })
  ])
  .then(([test, sungae, sizplay]) => {
    return Promise.all([
      sizplay.setManager(sungae),
      sungae.setManager(test),
      test.setManager(sungae)
    ]);
  });
};

module.exports = {
  sync,
  seed,
  models: {
    Employee
  }
};
