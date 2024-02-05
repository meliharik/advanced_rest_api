const express = require('express');
const { getPosts, createPost, getDetail, getUpdates, deletePost, searchPost } = require('../controllers/post.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/getPosts', getPosts);
router.post('/createPost', auth, createPost);
router.get('/getDetail/:id', getDetail);
router.patch('/getUpdates/:id', auth, getUpdates);
router.delete('/deletePost/:id',auth, deletePost);
router.get('/searchPost', auth, searchPost);

module.exports = router;