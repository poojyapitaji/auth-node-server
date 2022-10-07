# Auth Server
Auth server build using nodejs, express, sequelize, morgan, mysql & jsonwebtoken.

## Steps to setup
#### Install dependencies
`npm i`

#### Creating .env file
Create .env file and add the following :
```
API_PORT = 3001
##### Add any origin you want to allow after comma & do not add any space after comma
ALLOWED_ORIGINS= "http://localhost:3001,https://google.com" 
ACCESS_TOKEN_SECRET = c9705bb8e4962998fb3eb8e88fa34b346f500394755ba3c366ea3bb052b20b39
REFRESH_TOKEN_SECRET = db425a7033fa94140e29314cb84fa983ae8f19f16e27a1a59387951437d8de2a
ACCESS_TOKEN_EXPIRY = '10m'

LOGGER_MODE = '' # file / database / ''
LOGGER_TIMEZONE= 'Asia/Kolkata'

MYSQL_HOST = localhost
MYSQL_USER = root
MYSQL_PASSWORD = 
MYSQL_DATABASE = cms
MYSQL_TIMEZONE = 'Asia/Kolkata'
```

#### Run server
`npm run dev`
