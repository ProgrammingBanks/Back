const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const redis = require('redis')
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);

const { sequelize } = require('./models');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const passportConfig = require('./passport');

const app = express();

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig()

  // app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//redis session 사용
const redisClient = redis.createClient({ host: 'redis', logErrors: true})
const sess = {
  resave: false,
  saveUninitialized: false,
  secret: "secret_key",
  store: new RedisStore({ client: redisClient }),
};
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

// 라우터 추가
app.use('/', indexRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log('서버 실행 중!');
});