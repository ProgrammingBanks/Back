var express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const h = require('../lib/header');


const {msgTB}= require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
