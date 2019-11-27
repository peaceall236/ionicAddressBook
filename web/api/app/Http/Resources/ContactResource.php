<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource {
    public function toArray($request) {
        return [
            "id" => $this->contactID,
            "first_name" => $this->firstName,
            "last_name" => $this->lastName,
            "email_address" => \explode(";", $this->emails),
            "phone_address" => \explode(";", $this->phones)
        ];
    }
}