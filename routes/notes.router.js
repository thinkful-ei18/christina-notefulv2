'use strict';

const express = require('express');
const knex = require('../knex');


const router = express.Router();


// GET ALL NOTES AND HANDLE SEARCH
router.get('/notes', (req, res, next) => {
  const { searchTerm, folderId } = req.query;

  knex
    // return 'notes id' && 'note title' && 'note content' && 'foler id' && 'folder.name ALIAS folder_name'
    .select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
    // looking in the notes table
    .from('notes')
    // JOIN notes table with folder AT 'notes.folder id' (from notes table) && 'folder id' (from folder table)
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    // conditional query for searchTerm
    .where(function () {
      if (req.query.searchTerm) {
          this.whereRaw('LOWER("title") = ?', 'like', `%${searchTerm}%`)
          .orWhere('content', 'like', `%${searchTerm}%`)
        }
      if (folderId) {
        if (req.query.folderId) {
          this.where('folder_id', req.query.folderId)
        }
      }
    })
    // order results by 'note id' in asc order
    .orderBy('notes.id')
    // then send results as JSON
    .then(list => {
      res.json(list);
    })
    .catch(err => next(err));
});


// GET SINGLE NOTE PROVIDED ID
router.get('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex
    .select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('notes.id', noteId)
    .orderBy('notes.id')
    .then(note => {
      res.json(note);
    })
    .catch(err => next(err));
});


// UPDATE A SINGLE NOTE
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folder_id } = req.body;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content', 'folder_id'];

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

  knex
    .where('notes.id', noteId)
    .update({
      'title': `${title}`,
      'content': `${content}`,
      'folder_id': `${folder_id}`
    })
    .into('notes')
    .returning('id')
    .then(([id]) => {
      return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
      .from('notes')
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .where('notes.id', noteId);
    })
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });

  // knex('notes')
  // .where({'id' : `${noteId}`})
  // .update({
  //   'title': `${req.body.title}`,
  //   'content' : `${req.body.content}`
  // })
  // .then(note => res.json(note))
  // .catch(err => next(err));
  });
});


// CREATE A NEW NOTE 
router.post('/notes', (req, res, next) => {
  const { title, content, folder_id } = req.body;
  
  const newItem = { title, content, folder_id };

  let noteId;
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .insert(newItem)
    .into('notes')
    .returning('id')
    // 'returning' returns as array
    .then((idArray) => {
      noteId = idArray[0];
      // using new id returned by insert, chain on promise to select info
      return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    // promise returns array, must destructure with [result]
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      console.log(err);
  });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({'id' : `${id}`})
    .del()
    .then(note => res.json(note))
    .catch(err => next(err));
  
});

module.exports = router;