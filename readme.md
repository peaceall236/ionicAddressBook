This project has two parts

## First part is api
the api is written in lumen with the following endpoints

/contact/all
/contact/search
/contact/view/:id
/contact/update
/contact/delete/:id

## Second part ui
the ui is written with ionic/react

## installation
### DB Migrations
Go to /db folder `cd /db`
run `composer install`
run `vendor/bin/phinx init`
open the created phinx.yml
change configuraion

##### run migrations
inside /db run `./vendor/bin/phinx migrate -e development`

### Serve the api
Go to /api
run `composer install`
generate api key on https://onlinerandomtools.com/generate-random-string
add api key to .env file

run `php -S localhost:8000 -t public`

you can change the port and the url but remember to update the ionic configured api endpoint

### Serve Ionic App

run `cd /ui`
run `npm install`

make sure ionic-cli is installed

run `ionic serve`

if you have modified the api enpoint

run `vim /ui/.env` and update the REACT_APP_SERVER_URL variable


Thanks.


