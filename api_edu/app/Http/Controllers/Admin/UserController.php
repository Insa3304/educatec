<?php

namespace App\Http\Controllers\Admin;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\User\UserGCollection;
use App\Http\Resources\User\UserGResource;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)

    {
        $search =$request->search;
        $state = $request->state;
 

        $users = User::filterAdvance($search, $state)->where ("type_user",2)->orderby("id","desc")->get();

        return response()->json([
            "users"=> UserGCollection::make($users), //referencia a lista de usuarios, por eso se usa el collection
             
        ]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if($request->hasFile("imagen")){
            $path = Storage::putFile("users",$request->file("imagen"));
            $request->request-> add(["avatar" => $path]);
        }
        if($request->password){
            $request->request->add(["password "=>bcrypt($request->password)]);

        }
        $user = User::create($request-> all()); //almacena la informacion enviada desde el frontend en base a los fillable del modelo user
        return response()->json(["user" => UserGResource::make($user)]); //aqui es solo un usuario por eso se usar el resoruce
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if($request->hasFile("imagen")){
            if($user->avatar){
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile("users"->file("imagen"));
            $request->request-> add(["avatar" => $path]);
        }
        if($request->password){
            $request->request->add(["password "=>bcrypt($request->password)]);

        }
        
        $user->update ($request-> all()); 
                return response()->json(["user" => UserGResource::make($user)]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(["message" => 200]);
    }
}
