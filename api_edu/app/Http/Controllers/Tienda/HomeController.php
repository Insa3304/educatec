<?php


namespace App\Http\Controllers\Tienda;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Course\Course;
use App\Models\CoursesStudent;
use App\Models\Course\Categorie;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;
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
        $is_have_course = false;

        if (Auth::guard("api")->check()) {
            $course_student = CoursesStudent::where("user_id", Auth::guard("api")->user()->id)
                ->where("course_id", $course->id)
                ->first();
        
            if ($course_student) {
                $is_have_course = true;
            }
        }
        return response ()->json([
        "course"=> LandingCourseResource::make($course),
        "is_have_course" => $is_have_course,
    
        
        
        
    ]);
    
    
    }
    public function course_leason(Request $request, $slug)
    {
        // Buscar el curso por slug
        $course = Course::where("slug", $slug)->first();
    
        // Validar si el curso existe
        if (!$course) {
            return response()->json(["message" => 404, "message_text" => "EL CURSO NO EXISTE"], 404);
        }
    
        // Verificar si el usuario está autenticado
        $user = Auth::guard("api")->user();
        if (!$user) {
            return response()->json(["message" => 401, "message_text" => "USUARIO NO AUTENTICADO"], 401);
        }
    
        // Verificar si el usuario está inscrito en el curso
        $course_student = CoursesStudent::where("course_id", $course->id)
            ->where("user_id", $user->id)
            ->first();
    
        if (!$course_student) {
            return response()->json(["message" => 403, "message_text" => "TU NO ESTÁS INSCRITO EN ESTE CURSO"], 403);
        }
    
        // Retornar la información del curso si todo está correcto
        return response()->json([
            "course" => LandingCourseResource::make($course),
        ]);
    }
    





}





