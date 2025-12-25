const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/auth.controller");

const baseUrl = "/auth";

router.post(`${baseUrl}/register`, register);
router.post(`${baseUrl}/login`, login);

module.exports = router;
