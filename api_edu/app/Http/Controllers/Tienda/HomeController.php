<?php


namespace App\Http\Controllers\Tienda;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Course\Course;
use App\Models\Course\Categorie;
use App\Models\Discount\Discount;
use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Course\CourseHomeResource;
use App\Http\Resources\Ecommerce\Course\CourseHomeCollection;
use App\Http\Resources\Ecommerce\LandingCourse\LandingCourseResource;







class HomeController extends Controller
{
    public function home(Request $request)
    {
        $categories = Categorie::where("categorie_id",NULL)->withCount("courses")->orderBy("id","desc")->get();
       
        $courses = Course::where("state",2)->inRandomOrder()->limit(3)->get();
       
        $categories_courses = Categorie::where("categorie_id",NULL)->withCount("courses")
                        ->having("courses_count",">",0)
                        ->orderBy("id","desc")->take(4)->get();
        $group_courses_categories = collect([]);

        foreach ($categories_courses as $key => $categories_course) {
            $group_courses_categories->push([
                "id" => $categories_course->id,
                "name" => $categories_course->name,
                "name_empty" => str_replace(" ","",$categories_course->name),
                "courses" => CourseHomeCollection::make($categories_course->courses),
            ]);
        }

            return response()->json([
            "categories" => $categories->map(function($categorie){
                return [
                    "id" => $categorie->id,
                    "name" => $categorie->name,
                    "imagen" => env("APP_URL")."storage/".$categorie->imagen,
                    "course_count" => $categorie->courses_count,
                ];
            }),
            "courses_home" => CourseHomeCollection::make($courses),
            "group_courses_categories" => $group_courses_categories,
        ]);
    }


    public function course_detail($slug){
        $course = Course::where("slug",$slug)->first();
        if(!$course){
            return abort(404);
        }
        return response ()->json(["course"=> LandingCourseResource::make($course)]);

    }
}





