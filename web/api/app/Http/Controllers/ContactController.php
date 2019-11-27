<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use App\Contact;

use App\Http\Resources\ContactResource;

class ContactController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    
    /**
     *  Create new contact
     * 
     *  @param Request $request
     *  @return Response
     */
    public function add(Request $request) {
        Log::info(__CLASS__ . __METHOD__ . " API Function" );
        Log::info("Processing request");

        // Validating request
        try {
            $this->validate($request, [
                "first_name" => "required|string|max:30",
                "last_name" => "required|string|max:30",
                "phone_numbers" => "required|array|min:1",
                "phone_numbers.*" => "string|distinct|max:30",
                "emails" => "array",
                "emails.*" => "string|distinct|max:255"
            ]);

            Log::info("Received a valid request");
            try {

                // New Contact
                $contact = new Contact;
                $contact->firstName = $request->input("first_name");
                $contact->lastName = $request->input("last_name");
                $contact->phones = \implode(";", $request->input("phone_numbers"));
                $contact->emails = \implode(";", $request->input("emails", []));
                $contact->save();
                Log::info("Contact Created.");


                // response
                return response()->json([
                    'name' => 'Created',
                    'message' => "Create Contact Successful",
                    'code' => "00",
                    "meta" => [
                        "contact_id" => $contact->contactID
                    ]
                ], 200);
            } catch(\Exception $e) {
                Log::error("Db error: " . $e->getMessage());


                return response()->json([
                    'name' => 'Failed',
                    'message' => "Create Contact Failed. Contact System Support",
                    'code'=> "50",
                    "meta" => []
                ], 500);
            }

        } catch(ValidationException $e) {
            $arr = [];
            foreach ($e->errors() as $key => $value) {
                $arr[$key] = $value[0];
            }

            Log::error("Invalid payload. Errors: " . \json_encode($arr));

            return response()->json([
                'name' => 'Invalid payload',
                'message' => $arr,
                'code'=> "40",
                "meta" => []
            ], 400);
        }

    }


    /**
     *  Update existing contact
     * 
     *  @param Request $request
     *  @return Response
     */
    public function update(Request $request) {
        Log::info(__CLASS__ . __METHOD__ . " API Function" );
        Log::info("Processing request");

        // Validating request
        try {
            $this->validate($request, [
                "contact_id" => "required|exists:contacts,contactID",
                "first_name" => "required|string|max:30",
                "last_name" => "required|string|max:30",
                "phone_numbers" => "required|array|min:1",
                "phone_numbers.*" => "string|distinct|max:30",
                "emails" => "array",
                "emails.*" => "string|distinct|max:255"
            ]);

            Log::info("Received a valid request");
            try {
                // 
                $contact = Contact::find($request->input("contact_id"));
                $contact->firstName = $request->input("first_name");
                $contact->lastName = $request->input("last_name");
                $contact->phones = \implode(";", $request->input("phone_numbers"));
                $contact->emails = \implode(";", $request->input("emails", []));
                $contact->save();
                Log::info("Contact Updated.");


                // response
                return response()->json([
                    'name' => 'Updated',
                    'message' => "Update Contact Successful",
                    'code'=> "00",
                    "meta" => [
                        "contact_id" => $contact->contactID
                    ]
                ], 200);
            } catch(\Exception $e) {
                Log::error("Db error: " . $e->getMessage());


                return response()->json([
                    'name' => 'Failed',
                    'message' => "Update Contact Failed. Contact System Support",
                    'code'=> "50",
                    "meta" => []
                ], 500);
            }
        } catch(ValidationException $e) {
            $arr = [];
            foreach ($e->errors() as $key => $value) {
                $arr[$key] = $value[0];
            }

            Log::error("Invalid payload. Errors: " . \json_encode($arr));

            return response()->json([
                'name' => 'Invalid payload',
                'message' => $arr,
                'code'=> "40",
                "meta" => []
            ], 400);
        }

    }

    /**
     *  Remove contact
     * 
     *  @param int $contact
     *  @return Response
     */
    public function delete($contact) {
        Log::info(__CLASS__ . __METHOD__ . " API Function" );
        Log::info("Processing request");

        try {
            Contact::destroy($contact);

            Log::info("Contact Removed.");

            return response()->json([
                'name' => 'Deleted',
                'message' => "Contact removed.",
                'code'=> "00",
                "meta" => []
            ], 200);
        } catch (\Exception $e) {
            Log::error("Db error: " . $e->getMessage());


            return response()->json([
                'name' => 'Failed',
                'message' => "Contact does not exist",
                'code'=> "50",
                "meta" => []
            ], 500);
        }


    }

    /**
     *  Search contact
     * 
     *  @param Request $request
     *  @return ContactResource
     */
    public function search(Request $request) {
        Log::info(__CLASS__ . __METHOD__ . " API Function" );
        Log::info("Processing request");
        // print_r($request);

        // Validating request
        try {
            $this->validate($request, [
                "query" => "required|string"
            ]);

            Log::info("Received a valid request");

            $contacts = Contact::whereRaw("MATCH(firstName, lastName) AGAINST(? IN BOOLEAN MODE)", [
                $request->input("query") . "*"
            ])->get();

    
            $contacts = ContactResource::collection($contacts);
    
            Log::info("Sent response");

            return $contacts;
        } catch(ValidationException $e) {
            $arr = [];
            foreach ($e->errors() as $key => $value) {
                $arr[$key] = $value[0];
            }

            Log::error("Invalid payload. Errors: " . \json_encode($arr));

            return response()->json([
                'name' => 'Invalid payload',
                'message' => $arr,
                'code'=> "40",
                "meta" => []
            ], 400);
        } catch(\Exception $e) {
            Log::error("Exception. Errors: " . $e->getMessage());

            return response()->json([
                'name' => 'Error',
                'message' => "There was some processing request. Contact support.",
                'code'=> "50",
                "meta" => []
            ], 500);
        }

    }

    /**
     * 
     *  Get All Contacts
     * 
     *  @return ContactResource
     */
    public function all() {
        Log::info(__CLASS__ . __METHOD__ . " API Function" );
        Log::info("Processing request");

        Log::info("sent response");

        return ContactResource::collection(Contact::all());
    }

    /**
     *  Retrieve contact details
     * 
     *  @param int $id
     *  @return ContactResource
     */
    public function view($id) {
        Log::info(__CLASS__ . __METHOD__ . " API Function" );
        Log::info("Processing request");

        $contact = Contact::find($id);

        if ($contact) {
            Log::info("Contact Found.");
            return new ContactResource($contact);
        } else {
            return response()->json([
                'name' => 'Not Found',
                'message' => "Contact not found.",
                'code'=> "44",
                "meta" => []
            ], 404);
        }
    }
}
