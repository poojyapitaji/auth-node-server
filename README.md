<img src='https://i.ibb.co/5LG7Dj1/logo.png' width='100px'/>

# Auth Node Server
Auth server build using nodejs, express, sequelize, morgan, mysql & jsonwebtoken.

## Steps to setup
#### Install dependencies
`npm i`

#### Creating .env file
Create .env file in the root dir and add the following :
```
API_PORT = 3000
# Add any origin you want to allow after comma & do not add any space after comma
ALLOWED_ORIGINS= "http://localhost:3001,http://localhost:3000" 

ACCESS_TOKEN_SECRET = 
REFRESH_TOKEN_SECRET = 
ACCESS_TOKEN_EXPIRY = '30m'
REFRESH_TOKEN_EXPIRY = '1d' 

LOGGER_MODE = 'default' # file / database / default / keep empty if don't want to use
LOGGER_TIMEZONE= 'Asia/Kolkata'

MYSQL_HOST = localhost
MYSQL_USER = root
MYSQL_PASSWORD = 
MYSQL_DATABASE = auth
MYSQL_TIMEZONE = 'Asia/Kolkata'

MAIL_HOST = 
MAIL_PORT = 465
MAIL_SECURE = true #true for 465 false for other port
MAIL_USER = 
MAIL_PASSWORD = 
MAIL_FROM_NAME = "Auth Node Server 👻"
MAIL_FROM_EMAIL = 
```
#### Generate 64 character random string for ACCESS_TOKEN_SECREAT & REFRESH_TOKEN_SECRET
Open terminal / cmd run the below code two time for both the secrets.
```
node
require('crypto').randomBytes(64).toString('hex')
```
#### Run server
`npm run dev`
