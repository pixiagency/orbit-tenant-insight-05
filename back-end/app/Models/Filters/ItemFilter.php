<?php

namespace App\Models\Filters;

use App\Abstracts\QueryFilter;

class ItemFilter extends QueryFilter
{

    public function __construct($params = array())
    {
        parent::__construct($params);
    }

    public function name($term)
    {
        return $this->builder->where('name', "LIKE", "%$term%");
    }

    public function category_id($term)
    {
        return $this->builder->where('category_id', $term);
    }
}
