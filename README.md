# Secret Santa Claus

Angular + Express + MongoDB CRUD-like project to handle & improve holiday gifting-time process

Angular client
Server app utilizing MongoDB

## Idea

Instead of high-cost/low-effective Christmas gifting model (each member of a family gives a bunch of random gifts to everyone), the app implements a kind of a gift lottery, in which each person becomes a Santa Claus and takes care of a wishlist of a single member.

The user (one of the Christmas members) creates "event", adds himself and all other "members", distributes login URLs to companions. Then each member create his own list of gifts (a wishlist) plus a letter to the Santa Claus (this is a Christmas tradition in Poland to write one to receive presents), then when everything is complete (or almost complete) the main user triggers system to execute a lottery. Each member draws another member and secretely meets the requirements of the drawn person.

In the effect gifting cost becomes lower and everybody is satisfied and still surprised :)


## Implementation

The app consists of backend server (Node.js + Express.js + MongoDB/Mongoose) and frontend (Angular, Bootstrap).

Server app provides API for authentication/authorization, user, events and gifts management and internally it handles database communication and objects modeling. The application is simple and a bit primitive.

The frontend app is build with the latest version of Angular and it utilizes many components and modules. It makes use of RxJS, Bootstrap for minimalistic styling and several additional librarires.

## How to run


### Backend

```
cd ./santa-server
npm install
cp .env.sample .env
nano .env         #fill in the credentials and port
npm run start     # or node app.js
```

### Frontend

```
cd ./santa-frontend
npm install
nano src/environments/environment.ts   # edit API Url if required
ng serve            # may need @angular-cli installed globally
```



