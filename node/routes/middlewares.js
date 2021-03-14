// 로그인 미들웨워

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send('로그인 해주세요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
  };