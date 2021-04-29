# nginx,nodejs,mysql 도커

<img src="./backimage.jpg"/>

## 추가점
- redis 추가 (공부차원에서 넣어봄 신경쓰지 말것)
- redis 시험 페이지 index.js에 적용
- redis session 적용가능
- sequelize, seqeulize-auto, express 구동확인
- 기존의 도커는 호스팅을 중점으로 파일을 만들었다
- 지금 세팅은 개발에 집중하게  docker-compse.yml 23번째 줄에 command: tail -f /dev/null을 삽입

## 필독
- command: tail -f /dev/null 도커 프로세스가 끝나도 종료되지 않게 세팅
- vscode나 ssh로 연결해서 node 컨테이너로 들어간후 yarn dev || npm run dev를 쳐서 실행할것
- 치고나면 log가 나오지 않을것인데 그것은 pm2 monit쳐서 확인 가능하다

## docker 
- docker-compose up -d build를 통해 백그라운드와 빌드를 동시 가능
- docker-compose에서 command를 통해 시작할때 서버와 mysql nginx가 실행되게 하였다.

## node.js - express
- Login : passport 사용 (로그인 사용할때 필수적으로 사용되는 모듈)
<a href="http://www.passportjs.org/">passport.js</a>

```js
패스포트 예시
./passport/index.js
const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id }});
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};

./passport/local.js
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        return done(null, false, { reason: '존재하지 않는 이메일입니다!' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};

```
- helmet : http header의 보안관련 모듈
- morgan : express 내에서 로그 기록 남김
- express -view=ejs 폴더명 (express를 써서 간단한 필요 모듈을 설치하자)


## nginx
- nginx -g daemon off 명령어로 현재 백그라운드에서 실행
- nginx는 리버스 프록시 서버(어플리케이션과 클라이언트 사이에서 중계를 해주는 친구)
 - nginx기능 : 로드 밸런싱, 보안, 가속화 기타 등등
 ```js
로드 밸런싱의 예제 
 upstream testserver{
                least_conn;
                server 1**.***.**.**:8801 weight=10
                server 2**.***.**.**:8801 weight=10
                server 3**.***.**.**:8801 weight=10
                server 4**.***.**.**:8801 weight=10
 ```
 - docker에서는 --daemon off을 해주지 않으면 포그라운드에서 작동하기 때문에 꺼진다.

## pm2
- 싱글 스레드의 node.js를 보완하는 프로세스 매니저
- 한개의 코어만 사용하면 자원 활용이 취약하기 때문에 pm2로 클러스터 기능을 발휘할수있다.
- 기본적인 사용법은 pm2 start index.js
- --watch명령어가 뒤에 붙게되면 파일의 변화를 감지해서 바꿔준다.
- docker에서는 --no daemon 을 해주지 않으면 포그라운드에서 작동하기 때문에 꺼진다.
- pm2 plus를 통해 pm2사이트에서 gui로 관리하거나 내용을 볼수있다.
- pm2 plus는 유료이나 간단한 기능은 무료로 제공(무료의 pm2 monit도 있다)
``` js
pm2 stop <filename>
pm2 delete <filename>
pm2 log [<filename>]
pm2 list
pm2 monit
pm2 kill
pm2 show API
```
<a href="https://pm2.keymetrics.io/"> pm2 </a>

## mysql-sequelize
- ORM을 지원해주는 라이브러리
- 하지만 우리는 코드로 테이블을 만드는것은 귀찮기 때문에 workbench er 다이어그램 으로  테이블을 만들것이다.
- 만든 테이블은 sequelize auto로 만들어진 테이블을 코드화를 진행.
```js
yarn sequelize-auto -o "./models" -d DB이름 -h mysql -u root -p 3306 -x root -e mysql

여기서 host는 localhost가 아니라 컨테이너 이름으로 지정
```
- 위 명령어를 통해 er다이어 그램으로 만들어진 테이블이 /usr/src/app/model안에 들어가게 될것이다.
- 그뒤 부터는 orm을 사용하면된다.
- orm을 사용하는것은 backend의 springboot에서 가장 많이 쓰이는 방식으로 알아두면 도움이 될거같아 쓰게되었다.
- 참고 사이트
- <a href="https://thebook.io/080229/ch07/06/"> 제로초의 sequelize(최근 방식 적용) </a>
- <a href="https://velog.io/@cadenzah/sequelize-document-1"> 예전 공식 문서번역 </a>
- <a href="https://github.com/sequelize/sequelize-auto">sequelize-auto(최근 방식 적용) </a>

## 환경
- 알파인 
- http://localhost:80/
- mysql : ip: localhost , port 3306

## 사용 라이브러리

- 칼만 필터

> 칼만 필터는 과거의 정보와 새로운 측정값을 사용하여 측정값에 포함된 잡음을 제거시켜 값을 최적화 하는 필터
<a href="https://github.com/wouterbulten/kalmanjs"> kalmanjs </a>

- 사용법 예시
```js
var KalmanFilter = require('kalmanjs')

var kf = new KalmanFilter();
console.log(kf.filter(3));
console.log(kf.filter(2));
console.log(kf.filter(1));

```

```js
//Generate a simple static dataset
var dataConstant = Array.apply(null, {length: dataSetSize}).map(function() {
  return 4;
});
//Add noise to data
var noisyDataConstant = dataConstant.map(function(v) {
  return v + randn(0, 3);
});

//Apply kalman filter
var kalmanFilter = new KalmanFilter({R: 0.01, Q: 3});

var dataConstantKalman = noisyDataConstant.map(function(v) {
  return kalmanFilter.filter(v);
});
```

## Admin
> sequelize - express를 사용해서 만드는게 적정
<a href="https://github.com/ForestAdmin/forest-express-sequelize">Admin 페이지</a>

## JWT
>서버에 부담을 적게 주기위해 사용
> 사용처는 정보교류(보안), 회원인증

- 설치 : npm isntall jsonwebtoken rand-token

- 우리는 passport와 JWT를 같이 써야한다
```js
//passport/index.js
const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require("passport-local").Strategy;
```

- ID,PWD에 대한 전략
```js
const LocalStrategyOption = {
  username: "UserId",
  userpwd: "PWD",
};
async function idpwVerify(id, pwd, done) {
  let user;
  try {
    user = await userDAO.find(id);

    if (!user) return done(null, false);
    const CorrectPassword = await bcrypt.compare(pwd, user.userpwd);
    if (!CorrectPassword) return done(null, false);
  } catch (e) {
    done(e);
  }
  return done(null, user);
}
```
- 토큰 전략 생성
```js
const jwtStrategyOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: global.config.secret,
};

async function jwtVerifty(payload, done) {
  let user;
  try {
    user = await userDAO.find(payload.uid);
    if (!user) return done(null, false);
  } catch (e) {
    return done(e);
  }
  return done(null, user);
}
```

## 날씨 정보
- 기상청 RSS 사용
- http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=2714076000

## 해야할일
- [x] 백엔드 문서 설계화
- [x] rest-API 통신 문서 설계화
- [x] 개발환경  구축
- [x] 로그인 구현 
- [x] 받아오는 자료에 대한 CRUD
- [x] 앱과의 통신
- [ ] 로드 밸런싱
- [ ] AWS나 학교 서버에 배포  


