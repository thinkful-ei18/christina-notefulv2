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
  const noteId = req.params.id;

  knex
    .select()
    .from('tags')
    .where('id', noteId)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// UPDATE TAG
router.put('/tags/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { name } = req.body;

  knex
    .select()
    .from('tags')
    .where('id', noteId)
    .update('name', name)
    .returning(['id', 'name'])
    .then((result) => {
      res.json(result);
    })
    .catch(err => {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'tags_name_key') {
        err = new Error('Tag name is already taken');
        err.status = 409;
      } 
      next(err);
    });
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
router.delete('/tags/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex
    .del()
    .from('tags')
    .where('id', noteId)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next(); 
      }
    })
    .catch(next);
});

module.exports = router;