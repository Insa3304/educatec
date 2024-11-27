<?php


namespace App\Http\Controllers\Tienda;


use App\Models\User;
use App\Models\Sale\Sale;
use Illuminate\Http\Request;
use App\Models\CoursesStudent;
use App\Models\Sale\SaleDetail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\Ecommerce\Sale\SaleCollection;
use App\Http\Resources\Ecommerce\Course\CourseHomeResource;


class ProfileClientController extends Controller
{


    public function profile(Request $request)
    {
        $user = auth('api')->user();


        $enrolled_course_count = CoursesStudent::where("user_id",$user->id)->count();
        $active_course_count = CoursesStudent::where("user_id",$user->id)->where("clases_checkeds","<>",NULL)->count();
        $termined_course_count = CoursesStudent::where("user_id",$user->id)->where("state",2)->count();


        $enrolled_courses = CoursesStudent::where("user_id",$user->id)->get();
        $active_courses = CoursesStudent::where("user_id",$user->id)->where("clases_checkeds","<>",NULL)->get();
        $termined_courses = CoursesStudent::where("user_id",$user->id)->where("state",2)->get();


        $sale_details = SaleDetail::whereHas("sale",function($q) use($user){
            $q->where("user_id",$user->id);
        })->orderBy("id","desc")->get();


        $sales = Sale::where("user_id",$user->id)->orderBy("id","desc")->get();
        return response()->json([
            "user" => [
                "name" => $user->name,
                "surname" => $user->surname ?? '',
                "email" => $user->email,
                
                "avatar" => env("APP_URL")."storage/".$user->avatar,
            ],
            "enrolled_course_count" => $enrolled_course_count,
            "active_course_count" => $active_course_count,
            "termined_course_count" => $termined_course_count,
            "enrolled_courses" => $enrolled_courses->map(function($course_student){
                $clases_checkeds = $course_student->clases_checkeds ? explode(",",$course_student->clases_checkeds) : [];
                return [
                    "id" => $course_student->id,
                    "clases_checkeds" => $clases_checkeds,
                    "percentage" => intval(round((sizeof($clases_checkeds) / $course_student->course->count_class) * 100)),
                    "course" => CourseHomeResource::make($course_student->course),
                ];
            }),
            "active_courses" => $active_courses->map(function($course_student){
                $clases_checkeds = $course_student->clases_checkeds ? explode(",",$course_student->clases_checkeds) : [];
                return [
                    "id" => $course_student->id,
                    "clases_checkeds" => $clases_checkeds,
                    "percentage" => intval(round((sizeof($clases_checkeds) / $course_student->course->count_class) * 100)),

                    "course" => CourseHomeResource::make($course_student->course),
                ];
            }),
            "termined_courses" => $termined_courses->map(function($course_student){
                $clases_checkeds = $course_student->clases_checkeds ? explode(",",$course_student->clases_checkeds) : [];
                return [
                    "id" => $course_student->id,
                    "clases_checkeds" => $clases_checkeds,
                    "percentage" => intval(round((sizeof($clases_checkeds) / $course_student->course->count_class) * 100)),

                    "course" => CourseHomeResource::make($course_student->course),
                ];
            }),
            
        ]);
    }


   
}




