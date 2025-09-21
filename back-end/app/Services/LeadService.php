<?php

namespace App\Services;

use App\DTO\Tenant\LeadDTO;
use App\QueryFilters\LeadFilters;
use Illuminate\Database\Eloquent\Builder;
use App\Exceptions\GeneralException;
use App\Models\Tenant\Item;
use App\Models\Tenant\Lead;
use Auth;

class LeadService extends BaseService
{
    public function __construct(
        public Lead $model,
        public Item $itemModel,
        public StageService $stageService,
    ) {}

    public function getModel(): Lead
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
        $leads = $this->model->with($withRelations)->orderBy('id', 'desc');
        return $leads->filter(new LeadFilters($filters));
    }

    public function datatable(array $filters = [], array $withRelations = [])
    {
        $leads = $this->getQuery()->with($withRelations);
        return $leads->filter(new LeadFilters($filters));
    }

    public function index(array $filters = [], array $withRelations = [], ?int $perPage = null)
    {
        $query = $this->queryGet(filters: $filters, withRelations: $withRelations);
        if ($perPage) {
            return $query->paginate($perPage);
        }
        return $query->get();
    }

    private function checkItemQuantityThenUpdate(int $itemId, int $quantity)
    {
        $item = $this->itemModel->find($itemId);
        if ($item->quantity < $quantity) {
            throw new GeneralException(__('app.item_quantity_not_enough') . " with id :" . ' ' . $item->id);
        }
        $item->quantity -= $quantity;
        $item->save();
    }

    public function store(array $data)
    {
        if ($data['items']) {
            $deal_value = 0;
            foreach ($data['items'] as $item) {
                $deal_value += $item['price'] * $item['quantity'];
            }
            $lead = Lead::create([
                'contact_id' => $data['contact_id'],
                'stage_id' => $data['stage_id'],
                'status' => $data['status'],
                'deal_value' => $deal_value,
                'win_probability' => $data['win_probability'],
                'expected_close_date' => $data['expected_close_date'],
                'assigned_to_id' => $data['assigned_to_id'],
                'notes' => $data['notes'],
                'description' => $data['description'],
            ]);

            foreach ($data['items'] as $item) {
                $lead->variants()->attach($item['id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            $lead->load('variants.item');
        } else {
            $lead = Lead::create([
                'contact_id' => $data['contact_id'],
                'stage_id' => $data['stage_id'],
                'status' => $data['status'],
                'deal_value' => $data['deal_value'],
                'win_probability' => $data['win_probability'],
                'expected_close_date' => $data['expected_close_date'],
                'assigned_to_id' => $data['assigned_to_id'],
                'notes' => $data['notes'],
                'description' => $data['description'],
            ]);
        }

        return $lead;
    }

    public function show(int $id)
    {
        $lead = $this->findById($id);
        return $lead->load('contact', 'city', 'stage', 'user', 'variants.item');
    }


    public function update(int $id, LeadDTO $leadDTO)
    {
        $lead = $this->findById($id);
        $lead->update($leadDTO->toArray());

        // dd($leadDTO->items);
        $map = collect($leadDTO->items)->mapWithKeys(function ($row) {
            return [
                (int) $row['id'] => [
                    'price'    => (float) $row['price'],
                    'quantity' => (int) $row['quantity'],
                ],
            ];
        })->all();
        dd($map);


        $lead->tags()->sync([$tagId => ['note' => $note, 'active' => true]], false);
        $lead->variants()->detach();
        foreach ($data['variants'] as $variant) {
            $lead->variants()->attach($variant['id'], [
                'quantity' => $variant['quantity'],
                'price' => $variant['price'],
            ]);
        }
        $lead->load('variants.item');
        return $lead->fresh();
    }

    public function delete(int $id)
    {
        return $this->getQuery()->where('id', $id)->delete();
    }

    public function kanbanList()
    {
        return $this->stageService->queryGet(
            withRelations: [
                'leads' => function ($query) {
                    $query->where('assigned_to_id', Auth::user()->id)->with(['user', 'contact', 'variants.item']);
                },
                'pipeline'
            ],
            filters: ['assigned_to_id' => Auth::user()->id]
        )->get();
    }
}
