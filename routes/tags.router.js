'use strict';

const express = require('express');
const knex = require('../knex');
const { UNIQUE_VIOLATION } = require('pg-error-constants');
const router = express.Router();

// GET ALL TAGS
router.get('/tags', (req, res, next) => {
  knex
    .select()
    .from('tags')
    .then((results => {
      res.json(results);
    }))
    .catch(next);
});

// GET TAG BY ID
router.get('/tags/:id', (req, res, next) => {

});

// UPDATE TAG
router.put('/tags/:id', (req, res, next) => {

});

// CREATE TAG
router.post('/tags', (req, res, next) => {
  const { name } = req.body;

  // validate input
  if(!name) {
    const err = new Error('Missing name in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex
    .insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'tags_name_key') {
        err = new Error('Tags name is already in use');
        err.status = 409;
      }
      next(err);
    });
});

// DELETE TAG
router.delete('/tags', (req, res, next) => {

});

module.exports = router;