<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseGResource extends JsonResource
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
            "id" => $this->resource->id,
            "title" => $this->resource->title,
            "subtitle" => $this->resource->subtitle,
            "slug" => $this->resource->slug,
            "imagen" => env("APP_URL") . "storage/" . $this->resource->imagen,
            "categorie_id" => $this->resource->categorie_id,
            
            // Validar si la categoría existe antes de acceder a sus propiedades
            "categorie" => $this->resource->categorie ? [
                "id" => $this->resource->categorie->id,
                "name" => $this->resource->categorie->name
            ] : null,

            "sub_categorie_id" => $this->resource->sub_categorie_id,
            
            // Validar si la subcategoría existe antes de acceder a sus propiedades
            "sub_categorie" => $this->resource->sub_categorie ? [
                "id" => $this->resource->sub_categorie->id,
                "name" => $this->resource->sub_categorie->name
            ] : null,

            "precio_pen" => $this->resource->precio_pen,
            "user_id" => $this->resource->user_id,

            // Validar si el instructor existe antes de acceder a sus propiedades
            "user" => $this->resource->instructor ? [
                "id" => $this->resource->instructor->id,
                "full_name" => $this->resource->instructor->name . ' ' . $this->resource->instructor->surname,
                "email" => $this->resource->instructor->email,
            ] : null,

            "vimeo_id" => $this->resource->vimeo_id,
            "time" => $this->resource->time,
            "description" => $this->resource->description,
            "state" => $this->resource->state,
        ];
    }
}
