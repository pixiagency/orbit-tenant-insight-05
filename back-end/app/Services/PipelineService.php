<?php

namespace App\Services;

use App\DTO\Pipeline\PipelineDTO;
use App\Models\Tenant\Pipeline;
use App\QueryFilters\PipelineFilters;
use Illuminate\Database\Eloquent\Builder;


class PipelineService extends BaseService
{
    public function __construct(
        public Pipeline  $model,
    ) {}

    public function getModel(): Pipeline
    {
        return $this->model;
    }

    public function getTableName(): String
    {
        return $this->getModel()->getTable();
    }

    public function listing(array $filters = [], array $withRelations = [], $perPage = 5): \Illuminate\Contracts\Pagination\CursorPaginator
    {
        return $this->queryGet(filters: $filters, withRelations: $withRelations)->cursorPaginate($perPage);
    }

    public function queryGet(array $filters = [], array $withRelations = []): Builder
    {
        $industries = $this->model->with($withRelations)->orderBy('id', 'desc');
        return $industries->filter(new PipelineFilters($filters));
    }

    public function datatable(array $filters = [], array $withRelations = [])
    {

        $industries = $this->getQuery()->with($withRelations);
        return $industries->filter(new PipelineFilters($filters));
    }

    public function index(array $filters = [], array $withRelations = [], ?int $perPage = null)
    {
        //        dd('hi');
        $query = $this->queryGet(filters: $filters, withRelations: $withRelations);
        if ($perPage) {
            return $query->paginate($perPage);
        }
        return $query->get();
    }

    public function store(PipelineDTO $pipelineDTO): Pipeline
    {
        $pipeline = $this->model->create([
            'name' => $pipelineDTO->name,
        ]);
        foreach ($pipelineDTO->stages as $index => $stageData) {
            $pipeline->stages()->create([
                'name' => $stageData['name'],
                'seq_number' => $index + 1, // Assign sequence number dynamically
            ]);
        }
        return $pipeline->load('stages');
    }

    public function update(Pipeline $pipeline, PipelineDTO $pipelineDTO): Pipeline
    {
        $pipeline->update([
            'name' => $pipelineDTO->name,
        ]);
        $pipeline->stages()->delete();
        foreach ($pipelineDTO->stages as $index => $stageData) {
            $pipeline->stages()->create([
                'name' => $stageData['name'],
                'seq_number' => $index + 1,
            ]);
        }
        return $pipeline->load('stages');
    }

    public function show(int $id)
    {
        return $this->getQuery()->with('stages')->findOrFail($id);
    }


    public function delete(int $id)
    {
        $pipeline = $this->getQuery()->findOrFail($id);
        $pipeline->stages()->delete();
        return $pipeline->delete();
    }
}
