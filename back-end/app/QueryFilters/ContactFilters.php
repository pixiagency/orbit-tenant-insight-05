<?php

namespace App\QueryFilters;

use App\Abstracts\QueryFilter;

class ContactFilters extends QueryFilter
{

    public function __construct($params = array())
    {
        parent::__construct($params);
    }

    public function name($term)
    {
        return $this->builder->where('name', "LIKE", "%$term%");
    }

    public function contact_numbers($term)
    {
        return $this->builder->whereHas('contactNumbers', function ($query) use ($term) {
            $query->where('number', "LIKE", "%$term%");
        });
    }
}
