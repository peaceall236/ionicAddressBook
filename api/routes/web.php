<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/



$router->get('/', function () use ($router) {
    return $router->app->version();
});

## CONTACT ROUTES
$router->post('contact/search', ["uses" => "ContactController@search"]);
$router->post('contact/add', ["uses" => "ContactController@add"]);
$router->post('contact/update', ["uses" => "ContactController@update"]);
$router->get('contact/delete/{id}', ["uses" => "ContactController@delete"]);
$router->get("contact/view/{id}", ["uses" => "ContactController@view"]);
$router->get("contact/all", ["uses" => "ContactController@all"]);

