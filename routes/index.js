const router = require('express').Router();
const db = require('../db');
const { Employee } = db.models;

router.use((req, res, next) => {
  Promise.all([
    Employee.findAll({
      include: [
        { model: Employee, as: 'manages' },
        { model: Employee, as: 'manager' }
      ]
    })
  ])
    .then(([employees]) => {
      const managesPeople = employees.reduce( (total, employee) => {
        total.concat(employee);
        return total;
      });
      console.log(managesPeople);
      const managercount = employees.reduce((total, employee) => {
        if (employee.managerId) total++;
        return total;
      }, 0);
      res.locals.employeeCount = employees.length;
      res.locals.managerCount = managercount;
      res.locals.path = req.url;
      next();
    })
    .catch(next);
});

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home' });
});

router.get('/employees', (req, res, next) => {
  Promise.all([
    Employee.findAll({
      include: [
        { model: Employee, as: 'manages' },
        { model: Employee, as: 'manager' }
      ]
    })
  ])
    .then(([ employees ]) => {
      res.render('employees', { employees });
    })
    .catch(next);
});

router.post('/employees', (req, res, next) => {
  Employee.createFromForm(req.body)
    .then(() => {
      res.redirect('/employees');
    })
    .catch(next);
});

router.delete('/employees/', (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employee => employee.destroy())
    .then(() => res.redirect('/employees'))
    .catch(next);
});

router.put('/employees/:id', (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employee => {
      Object.assign(employee, req.body);
      return employee.save();
    })
    .then(() => res.redirect('/employees'))
    .catch(next);
});

module.exports = router;
