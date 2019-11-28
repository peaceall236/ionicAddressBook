<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model {

    /**
     *  Specify custom table name
     * 
     *  @var string
     */
    protected $table = 'contacts';

    /**
     *  Specify custom table primary key
     * 
     *  @var string
     */
    protected $primaryKey = "contactID";

    /**
     * Change default timestamps name
     * 
     * @var string
     */
    const CREATED_AT = 'dateCreated';
    const UPDATED_AT = 'dateModified';


    

    protected $fillable = [
        "firstName", "lastName", "emails", "phones"
    ];
}