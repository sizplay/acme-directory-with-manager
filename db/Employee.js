const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: false
    }
  }
}, {
    getterMethods: {
      name: function () {
        let idxName = this.email.indexOf('@');
        return this.email.slice(0, idxName);
      },
      emailProvider: function() {
        let idxName = this.email.indexOf('@');
        return this.email.slice(idxName + 1);
      }
    }
  });

Employee.belongsTo(Employee, { as: 'manager' });
Employee.hasMany(Employee, { as: 'manages', foreignKey: 'managerId' });

Employee.createFromForm = function (body) {
  if (body.managerId === '-1') {
    delete body.managerId;
  }
  return this.create(body);
};

Employee.temp = function(body) {
  console.log(body);
};

module.exports = Employee;
