const express = require('express');
const { getPosts, createPost, getDetail, getUpdates, deletePost } = require('../controllers/post.js');

const router = express.Router();

router.get('/getPosts', getPosts);
router.post('/createPost', createPost);
router.get('/getDetail/:id', getDetail);
router.patch('/getUpdates/:id', getUpdates);
router.delete('/deletePost/:id', deletePost);

module.exports = router;