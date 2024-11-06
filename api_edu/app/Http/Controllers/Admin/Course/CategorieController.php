<?php


namespace App\Http\Controllers\Admin\Course;


use Illuminate\Http\Request;
use App\Models\Course\Categorie;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\Course\Categorie\CategorieResource;
use App\Http\Resources\Course\Categorie\CategorieCollection;


class CategorieController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $state = $request->state;


        $categories = Categorie::filterAdvance($search,$state)->orderby("id","desc")->get();


        return response()->json([
            "categories" => CategorieCollection::make($categories),
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
    public function store(Request $request) //funcionalidad para crear un nuevo registro de categoria
    {
        if($request->hasFile("portada")){
            $path = Storage::putFile("categories",$request->file("portada"));
            $request->request->add(["imagen" => $path]); //almaceno en la variable imagen para que se asigne de manera masiva
        }
        $categorie = Categorie::create($request->all());


        return response()->json(["categorie" => CategorieResource::make($categorie)]);
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
        $categorie = Categorie::findOrFail($id);// llamo a la categoria creada
        if($request->hasFile("portada")){ //verifico que quiero subir una imagen
            if($categorie->imagen){
                Storage::delete($categorie->imagen);
            }
            $path = Storage::putFile("categories",$request->file("portada"));
            $request->request->add(["imagen" => $path]);//ubicacion de la categoria
        }


        $categorie->update($request->all());


        return response()->json(["categorie" => CategorieResource::make($categorie)]);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();
        return response()->json(["message" => 200]);
    }
}



