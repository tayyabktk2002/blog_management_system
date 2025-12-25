const express = require("express");
const router = express.Router();
const { getPostList , createPost, removePost, editPost, postDetails, userPostList} = require("../controller/post.controller");
const { verifyToken } = require("../middleware/auth.middleware");


const baseUrl = "/post";

router.get(`${baseUrl}/list`, getPostList);
router.post(`${baseUrl}/create`, verifyToken , createPost);
router.delete(`${baseUrl}/remove/:id`, verifyToken, removePost);
router.put(`${baseUrl}/update/:id`, verifyToken, editPost);
router.get(`${baseUrl}/details/:id`, postDetails);
router.get(`${baseUrl}/user-posts`, verifyToken, userPostList);

module.exports = router;
