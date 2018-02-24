const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
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

Employee.updateFromForm = function(id, body) {
  if (body.managerId === '-1') {
    body.managerId = null;
  }
  return Employee.findById(id)
  .then( employee => {
    Object.assign(employee, body);
    return employee.save();
  });
};

module.exports = Employee;
