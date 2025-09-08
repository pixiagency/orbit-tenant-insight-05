<?php

namespace App\Services\Tenant;

use App\Exceptions\GeneralException;
use App\Models\Tenant\Item;
use Illuminate\Database\Eloquent\Builder;
use App\DTO\Item\ItemDTO;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class ItemService extends BaseService
{
    public function __construct(
        public Item $model,
    ) {}

    public function getModel(): Item
    {
        return $this->model;
    }

    public function getAll(array $filters = [])
    {
        return $this->queryGet($filters)->get();
    }

    public function getTableName(): string
    {
        return $this->getModel()->getTable();
    }

    public function listing(array $filters = [], array $withRelations = [], $perPage = 5): \Illuminate\Contracts\Pagination\CursorPaginator
    {
        return $this->queryGet(filters: $filters, withRelations: $withRelations)->cursorPaginate($perPage);
    }

    public function queryGet(array $filters = [], array $withRelations = []): Builder
    {
        $defaultRelations = ['category'];
        $withRelations = array_merge($defaultRelations, $withRelations);
        $items = $this->model->with($withRelations)->ordered();
        return $items;
    }

    public function index(array $filters = [], array $withRelations = [], ?int $perPage = null)
    {
        $query = $this->queryGet(filters: $filters, withRelations: $withRelations);
        if ($perPage) {
            return $query->paginate($perPage);
        }
        return $query->get();
    }

    public function store(ItemDTO $itemDTO): Item
    {
        try {
            DB::beginTransaction();

            // If this priority is set as default, unset all other defaults
            // if ($itemDTO->is_default) {
            //     $this->model->where('is_default', true)->update(['is_default' => false]);
            // }

            $item = $this->model->create($itemDTO->toArray());

            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new GeneralException('Failed to create item: ' . $e->getMessage());
        }
    }

    public function update(int $id, ItemDTO $itemDTO): Item
    {
        try {
            DB::beginTransaction();

            $item = $this->findById($id);

            // If this priority is set as default, unset all other defaults
            // if ($itemDTO->is_default) {
            //     $this->model->where('is_default', true)->where('id', '!=', $id)->update(['is_default' => false]);
            // }

            // $priority->update($priorityDTO->toArray());

            DB::commit();
            return $item->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new GeneralException('Failed to update priority: ' . $e->getMessage());
        }
    }

    public function destroy(int $id): bool
    {
        try {
            DB::beginTransaction();

            $priority = $this->findById($id);
            // Check if priority is being used by tasks
            if ($priority->tasks()->exists()) {
                throw new GeneralException(__('app.cannot_delete_priority_used_by_tasks'));
            }

            $result = $priority->delete();

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new GeneralException('Failed to delete priority: ' . $e->getMessage());
        }
    }
}
