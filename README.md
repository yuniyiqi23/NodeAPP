# Blog开发说明
1.Express中next的理解<br>
2.Mongoose ObjectId的理解<br>
3.数据库设计（category、tag）<br>
4.Promise的理解<br>
5.做项目过程中学到的经验<br>
6.全文索引<br>
db.getCollection('posts').ensureIndex({title:"text",content:"text"},{weights:{title:1,content:2}})<br>

## 网站部署<br>
1.自动化部署说明<br>

## 网站安全性<br>
1.安全性相关的HTTP头
通过使用Helmet模块设置<br>
```node
const express = require('express');  
const helmet = require('helmet');
const app = express();
app.use(helmet());
```
测试网站安全性：http://cyh.herokuapp.com/cyh<br>
2.暴力破解保护（通过限制用户在一定时间内登录次数来实现）
通过使用中间件express-rate-limit来实现<br>
```node
const rateLimit = require("express-rate-limit");
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);
```
3.使用nsp和requireSafe管理第三方的依赖库的安全问题
```node
$ npm i nsp -g
$ nsp check
```

