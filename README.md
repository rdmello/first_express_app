# First Express App

A simple way for me to learn the MEAN stack. This currently includes an Express app running on a Node.js server with a remote MongoDB database (using Monk) and WebSockets support using Socket.io. User authentication is done locally using Passport. 

Account creation, login, profile, chat, and logout have been implemented. The site is hosted on an https domain with Lets Encrypt certificates. 

Todo: 

1. Move from Monk to Mongoose for MongoDB integration. Use bcrypt or similar to encrypt passwords in database.

2. Remove Express-Sessions and store user session in database instead of memory.

3. Add Rooms for socket.io sessions

4. Replace Jade with handlebars or some better HTML preprocessor. 

4. Add Captcha to login pages to stop spammers

Cool things to try out: 

1. Typescript

2. SCSS

2. Babel

Visit: https://rylan.coffee/first_express_app for the homepage. Also see /newUser to add a new user

Installation: Clone this repository, enter project directory and run npm install. 

Usage: npm start in project directory


