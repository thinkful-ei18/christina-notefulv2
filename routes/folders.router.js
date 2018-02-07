'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

// GET ALL FOLDERS
router.get('/folders', (req, res, next) => {
  knex('folders')
    .select('id', 'name')
    .then((list) => {
      res.json(list);
    })
    .catch((err) => {
      next(err);
    });
});


// GET FOLDER BY ID
router.get('/folders/:id', (req, res, next) => {

});

// FOLDER UPDATE
router.put('/folders/:id', (req, res, next) => {

});

// CREATE FOLDER
router.post('/folders', (res, req, next) => {

});

// DELETE FOLDER
router.delete('/folders/:id', (res, req, next) => {

});

module.exports = router;