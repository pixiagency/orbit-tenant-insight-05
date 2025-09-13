<?php

namespace App\Services;


use App\QueryFilters\LeadFilters;
use Illuminate\Database\Eloquent\Builder;
use App\DTO\Lead\LeadDTO;
use App\Exceptions\GeneralException;
use App\Models\Tenant\Item;
use App\Models\Tenant\Lead;

class LeadService extends BaseService
{
    public function __construct(
        public Lead $model,
        public Item $itemModel,
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
                $this->checkItemQuantityThenUpdate($item['id'], $item['quantity']);

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
                $lead->items()->attach($item['id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            $lead->load('items');
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


    public function update(int $id, LeadDTO $leadDTO)
    {
        // Find the lead by ID or fail if not found
        $lead = $this->model->findOrFail($id);
        // Update lead fields
        $leadData = $leadDTO->toArray();
        $lead->update($leadData);
        // Handle industries relationship
        if (!empty($leadDTO->industries)) {
            $lead->industries()->sync($leadDTO->industries);
        } else {
            $lead->industries()->detach(); // Remove all industries if empty
        }
        // Handle services and categories
        $servicesData = [];
        if (!empty($leadDTO->services)) {
            foreach ($leadDTO->services as $serviceId) {
                if (is_numeric($serviceId) && $serviceId > 0) {
                    $categoryId = $leadDTO->serviceCategories[$serviceId] ?? null;
                    $servicesData[$serviceId] = ['category_id' => $categoryId];
                }
            }
            $lead->services()->sync($servicesData);
        } else {
            $lead->services()->detach();
        }
        // Handle custom fields relationship
        $customFieldsData = [];
        if (!empty($leadDTO->customFields)) {
            foreach ($leadDTO->customFields as $fieldId => $value) {
                $customFieldsData[$fieldId] = ['value' => $value];
            }
            $lead->customFields()->sync($customFieldsData);
        } else {
            $lead->customFields()->detach();
        }
        if ($leadDTO->stage_id) {
            // Mark the previous stage exit date
            $previousStage = $lead->stages()->latest('pivot_created_at')->first();
            if ($previousStage) {
                $previousStage->pivot->update(['exit_date' => now()]);
            }

            // Attach new stage with start date
            $lead->stages()->attach($leadDTO->stage_id, [
                'start_date' => now(),
            ]);
        }
        return $lead;
    }


    public function delete(int $id)
    {
        return $this->getQuery()->where('id', $id)->delete();
    }
}
