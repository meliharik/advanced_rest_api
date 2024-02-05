const PostSchema = require('../models/post.js');

const getPosts = async (req, res) => {
   try{
      const posts = await PostSchema.find();
      res.status(200).json({ status: 'success', posts });

   }
   catch (error) {
      res.status(500).json({ message: error.message });
   }
}

const createPost = async (req, res) => {
   try{
      const newPost = await PostSchema.create(req.body);
      res.status(201).json({ status: 'success', newPost });

   }
   catch (error) {
      res.status(500).json({ message: error.message });
   }
}

const getDetail = async (req, res) => {
   try{
      const { id } = req.params;
      const post = await PostSchema.findById(id);
      res.status(200).json({ status: 'success', post });

   }
   catch (error) {
      res.status(500).json({ message: error.message });
   }
}

const getUpdates = async (req, res) => {
   try{
      const post = await PostSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.status(200).json({ status: 'success', post });

   }
   catch (error) {
      res.status(500).json({ message: error.message });
   }
}

const deletePost = async (req, res) => {
   try{
      PostSchema.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: 'success'});

   }
   catch (error) {
      res.status(500).json({ message: error.message });
   }
}


module.exports = { getPosts, createPost, getDetail, getUpdates, deletePost };