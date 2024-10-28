<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class UserGResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id"=> $this->resource->id,
            "name"=> $this->resource->name,
            "surname"=> $this->resource->surname,
            "email"=> $this->resource->email,
            "role"=> $this->resource->role,
            "state"=> $this->resource->state,
            "create_at"=> $this->resource->created_at-> format("Y-m-d h:i:s"),
            "avatar"=> env("APP_URL")."storage/" .$this->resource->avatar, //toma la url de la variable de entorno
        ];
    }
}

//solo registro