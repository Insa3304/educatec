<?php


namespace App\Models\Course;


use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Course extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "title",
        "subtitle",
        "slug",
        "imagen",
        
        "precio",
        "categorie_id",
        "sub_categorie_id",
        "user_id",
        
        "idioma",
        "vimeo_id",
        "time",
        "description",

        "state",
    ];


    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }


    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }


    public function instructor()
    {
        return $this->belongsTo(User::class,'user_id');
    }


    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }


    public function sub_categorie()
    {
        return $this->belongsTo(Categorie::class);
    }


    public function sections()
    {
        return $this->hasMany(CourseSection::class);
    }

    function AddTimes($horas)
    {
        $total = 0;
        foreach($horas as $h) {
            $parts = explode(":", $h);
            $total += $parts[2] + $parts[1]*60 + $parts[0]*3600;
        }
        $hours = floor($total / 3600);
        $minutes = floor(($total / 60) % 60);
        $seconds = $total % 60;


        return $hours." hrs ".$minutes." mins";
    }




    public function getCountClassAttribute()
    {
        $num = 0;

        foreach ($this->sections as $key => $section) {
            $num += $section->clases->count();
        }
        return $num;
    }

    public function getTimeCourseAtribute(){
        $times = [];
        foreach ($this->sections as $keyS => $section) {
         foreach ($section->clases as $keyC => $clase) {
             array_push($times,$clase->time);
         }
        }
        return $this->AddTimes($times);
 
 
 
    }





    function scopeFilterAdvance($query,$search,$state)
    {
        if($search){
            $query->where("title","like","%".$search."%");
        }
        if($state){
            $query->where("state",$state);
        }
       
        return $query;
    }
}





