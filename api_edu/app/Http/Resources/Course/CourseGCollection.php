<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Http\Resources\Course\CourseGResource;

class CourseGCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return[
            "data" =>CourseGResource::collection($this->collection),
        ];
    }
}
