'use strict';

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
/* 
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);
*/

// Get All (and search by query)
/* ========== GET/READ ALL NOTES ========== */
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  // knex('notes')
  //   .select()
  //   !req.query.searchTerm ? '' : `.where({'title': ${searchTerm}})`
  //   .then(list => res.json(list))
  //   .catch(err => next(err));




  knex('notes')
      .select('notes.id', 'title', 'content')
      .where(function () {
        if (searchTerm) {
        this.where('title', 'like', `%${searchTerm}%`)
          .orWhere('content', 'like', `%${searchTerm}%`)
        }
      })
      .then(list => res.json(list))
      .catch(err => next(err));
});





/* ========== GET/READ SINGLE NOTES ========== */
router.get('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  knex('notes')
    .select('notes.id', 'title', 'content')
    .where({'notes.id' : `${noteId}`})
    .then(note => res.json(note[0]))
    .catch(err => next(err));
});





/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
  .where({'id' : `${noteId}`})
  .update({
    'title': `${req.body.title}`,
    'content' : `${req.body.content}`
  })
  .then(note => res.json(note))
  .catch(err => next(err));
  });
});


/* ========== POST/CREATE ITEM ========== */
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  
  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert(newItem)
    .then(note => res.json(note))
    .catch(err => next(err)); 

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({'id' : `${id}`})
    .del()
    .then(note => res.json(note))
    .catch(err => next(err));
  
  /*
  notes.delete(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */
});

module.exports = router;