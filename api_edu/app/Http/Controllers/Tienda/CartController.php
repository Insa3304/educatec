<?php

namespace App\Http\Controllers\Tienda;

use App\Models\Sale\Cart;
use Illuminate\Http\Request;
use App\Models\CoursesStudent;
use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Cart\CartResource;
use App\Http\Resources\Ecommerce\Cart\CartCollection;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth('api')->user();


        $carts = Cart::where("user_id",$user->id)->get();


        return response()->json(["carts" => CartCollection::make($carts)]);
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
        //si el curso ya pertenece al estudiante
        $user = auth('api')->user();
        $is_have_course = CoursesStudent::where("user_id",$user->id)->where("course_id",$request->course_id)->first();
        if($is_have_course){
            return response()->json(["message"=> 403, "message_text" =>"Ya haz adquirido el curso"]);
        }
        //si el curso existe en el carrito
        $is_exist_cart = Cart::where("user_id",$user->id)->where("course_id",$request->course_id)->first();
        if($is_exist_cart){
            return response()->json(["message"=> 403, "message_text" =>"Ya haz agregado el curso al carrito"]);
        }

       

        $request->request->add(["user_id" =>$user->id]);
        $cart = Cart::create($request->all());

        return response()->json(["cart"=>CartResource::make($cart)]);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();


        return response()->json(["message" => 200]);



    }
}
