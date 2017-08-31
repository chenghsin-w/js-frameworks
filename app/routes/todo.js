const express = require('express');
const router = express.Router();
const Factory = require('../services/factory');

router.get('', function(req, res, next) {
  Factory.getModelService().models.todo.findAll().then(tasks => {
    res.json(tasks);
  }).catch(ex => {
    next(ex);
  });
});

router.get('/:id', function(req, res, next) {
  Factory.getModelService().models.todo.findOne({where: {id: req.params.id}}).then(task => {
    if (task) {
      res.json(task);
    } else {
      var err = new Error('Not Found');
      err.status = 404;
      throw err;
    }
  }).catch(ex => {
    next(ex);
  });
});

router.post('', function(req, res, next) {
  Factory.getModelService().models.todo.create(req.body).then(task => {
    res.json(task);
  }).catch(ex => {
    next(ex);
  });
});

router.put('/:id', function(req, res, next) {
  Factory.getModelService().models.todo.findOne({where: {id: req.params.id}}).then(task => {
    if (task) {
      return task.update(req.body);
    } else {
      var err = new Error('Not Found');
      err.status = 404;
      throw err;
    }
  }).then(task => {
    res.json(task);
  }).catch(ex => {
    next(ex);
  });
});

router.delete('/:id', function(req, res, next) {
  Factory.getModelService().models.todo.findOne({where: {id: req.params.id}}).then(task => {
    if (task) {
      return task.destroy();
    } else {
      var err = new Error('Not Found');
      err.status = 404;
      throw err;
    }
  }).then(task => {
    res.json(task);
  }).catch(ex => {
    next(ex);
  });
});

module.exports = router;
