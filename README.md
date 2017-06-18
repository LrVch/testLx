#### Стурктура проекта:

папка app => разработка проекта

папка dist => сборка проекта
server.js => локальный сервер node.js возвращает статику для сборки проекта и данные

#### Для запуска проекта необходимо установить:
> nodejs => v4.4.4
npm => v2.15.1
compass => http://compass-style.org/
sass => http://sass-lang.com/
bower => v1.7.9

#### Запустить следующие команды:
`$ npm install gulp-cli -g`
`$ npm install gulp -g`
`$ npm install -g browser-sync`
`$ npm i`
`$ bower i`

#### Запуск:

- разработка
  `$ node server.js` - запустится локальный сервер => http://localhost:4040
  `$ gulp` - запустится локальный сервер для разработки => http://localhost:3000

- сборка
  `$ gulp build` - сборка проекта
  `$ node server.js` - запустится локальный сервер => http://localhost:4040 и вернет статику

> ** чтобы просто посмотреть верстку достаточно выполнить $ node server.js из корня проетка и открыть в браузере http://localhost:4040

