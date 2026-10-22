<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBackgroundModeColumnsToThemeTable extends Migration
{
    public function up()
    {
        Schema::table('theme', function (Blueprint $table) {
            $table->string('backgroundimage_dark')->nullable()->after('backgroundimage');
        });
    }

    public function down()
    {
        Schema::table('theme', function (Blueprint $table) {
            $table->dropColumn('backgroundimage_dark');
        });
    }
}
