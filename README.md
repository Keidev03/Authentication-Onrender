<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


/project-root
│
├── /client         # Thư mục cho React frontend (TypeScript)
│   ├── /public
│   ├── /src
│   │   ├── /assets    # Tài nguyên như hình ảnh, CSS, fonts...
│   │   ├── /components # Các thành phần React
│   │   ├── /hooks      # Các hook dùng chung
│   │   ├── /pages      # Các trang chính
│   │   ├── /services   # Giao tiếp với API backend (Axios, Fetch API)
│   │   ├── /store      # Quản lý trạng thái ứng dụng (Redux, Context API)
│   │   ├── /types      # Định nghĩa kiểu cho TypeScript
│   │   ├── App.tsx     # Component chính của React
│   │   ├── index.tsx   # File entry chính cho ứng dụng React
│   │   └── ...         # Các file khác
│   ├── tsconfig.json   # Cấu hình TypeScript cho React
│   └── package.json    # Dependencies của frontend (React, TypeScript, v.v.)
│
├── /server         # Thư mục cho Express API backend
│   ├── /src
│   │   ├── /controllers # Các controller để xử lý request
│   │   ├── /middlewares # Các middleware dùng cho request (Xác thực, logs)
│   │   ├── /models      # Các schema hoặc model (nếu dùng Mongoose/Sequelize)
│   │   ├── /routes      # Định nghĩa các route của API
│   │   ├── /services    # Các service xử lý logic
│   │   ├── app.ts       # Khởi tạo Express app và kết nối các middleware
│   │   └── server.ts    # Entry point để khởi chạy Express server
│   ├── tsconfig.json    # Cấu hình TypeScript cho Express
│   └── package.json     # Dependencies của backend Express
│
├── /nest-server    # Thư mục cho NestJS backend
│   ├── /src
│   │   ├── /common      # Các module hoặc guard dùng chung (auth, pipe...)
│   │   ├── /modules     # Các module con của NestJS (UserModule, AuthModule...)
│   │   │   ├── /auth
│   │   │   │   ├── auth.controller.ts   # Controller cho module auth
│   │   │   │   ├── auth.service.ts      # Service cho module auth
│   │   │   │   ├── auth.module.ts       # Khai báo module auth
│   │   │   ├── /user
│   │   │   │   ├── user.controller.ts   # Controller cho module user
│   │   │   │   ├── user.service.ts      # Service cho module user
│   │   │   │   ├── user.module.ts       # Khai báo module user
│   │   ├── /config      # Cấu hình cho NestJS (database, JWT, .env)
│   │   ├── app.module.ts  # Module chính của ứng dụng
│   │   ├── main.ts        # File entry chính cho NestJS app
│   ├── tsconfig.json      # Cấu hình TypeScript cho NestJS
│   └── package.json       # Dependencies của backend NestJS
│
├── /shared         # Chứa các tài nguyên dùng chung giữa client và server (nếu có)
│   ├── /types      # Định nghĩa TypeScript dùng chung cho cả frontend và backend
│   └── /utils      # Các hàm tiện ích dùng chung
│
├── .gitignore      # Những file/thư mục không cần đưa vào git
├── package.json    # Dependencies cho toàn bộ project (có thể dùng yarn workspace)
├── README.md       # Thông tin về dự án
└── tsconfig.json   # Cấu hình TypeScript chung (nếu cần)