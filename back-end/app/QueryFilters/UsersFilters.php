<?php

namespace App\QueryFilters;

use App\Abstracts\QueryFilter;
use Illuminate\Database\Eloquent\Builder;

class UsersFilters extends QueryFilter
{

    public function __construct($params = array())
    {
        parent::__construct($params);
    }

    public function email($term)
    {
        return $this->builder->where('email', $term);
    }
    public function phone($term)
    {
        return $this->builder->where('phone', $term);
    }
    public function status($term)
    {
        return $this->builder->where('status', $term);
    }
    public function type($term)
    {
        return $this->builder->where('type', $term);
    }

    public function city_id($term)
    {
        return $this->builder->where('city_id', $term);
    }

    public function area_id($term)
    {
        return $this->builder->where('area_id', $term);
    }

    public function keyword($term)
    {
        return $this->builder->search($term);
    }

    public function role($term)
    {
        return $this->builder->role($term);
    }
}
