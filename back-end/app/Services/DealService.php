<?php

namespace App\Services;

use App\Enums\DealType;
use App\Models\Tenant\Deal;
use App\Models\Tenant\Item;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DealService extends BaseService
{
    public function __construct(
        public Deal $model,
        public Item $itemModel,
    ) {}

    public function getModel(): Deal
    {
        return $this->model;
    }

    public function create(array $data): Deal
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];

            if (empty($items)) {
                throw ValidationException::withMessages(['items' => ['At least one item is required.']]);
            }

            // Merge duplicate items
            $mergedItems = $this->mergeItems($items);

            // Validate and prepare items
            $itemsData = $this->prepareItems($mergedItems);

            $total = collect($itemsData['pivot'])->sum('total');

            $afterDiscount = $this->afterDiscount($total, $data['discount_value'], $data['discount_type']);

            $data['total_amount'] = $this->afterTax($afterDiscount, $data['tax_rate']);

            // Create deal
            $deal = $this->model->create(collect($data)->except('items')->toArray());

            // Attach items
            $deal->items()->attach($itemsData['pivot']);

            return $deal->load('items', 'stage.pipeline');
        });
    }

    private function mergeItems(array $items): array
    {
        return collect($items)
            ->groupBy('item_id')
            ->map(fn($group) => [
                'item_id' => $group->first()['item_id'],
                'quantity' => $group->sum('quantity')
            ])
            ->values()->toArray();
    }

    private function prepareItems(array $items): array
    {
        $itemIds = collect($items)->pluck('item_id');

        // Lock items and get current data
        $dbItems = $this->itemModel->whereIn('id', $itemIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        $pivot = [];
        $errors = [];

        foreach ($items as $item) {
            $itemId = $item['item_id'];
            $quantity = max(1, $item['quantity']);

            $dbItem = $dbItems->get($itemId);

            if (!$dbItem) {
                $errors[] = "Item ID {$itemId} not found.";
                continue;
            }

            // Check stock
            if ($dbItem->quantity !== null && $dbItem->quantity < $quantity && $dbItem->type == DealType::PRODUCT_SALE->value) {
                $errors[] = "Not enough stock for {$dbItem->name}. Available: {$dbItem->quantity}";
                continue;
            }

            $price = (float) $dbItem->price;

            $pivot[$itemId] = [
                'quantity' => $quantity,
                'price' => $price,
                'total' => $quantity * $price,
            ];
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages(['items' => $errors]);
        }

        return compact('pivot');
    }

    private function afterDiscount(float $totalAmount, float $discountValue, string $discountType): float
    {
        if ($discountType == 'percentage') {
            $totalAmount = $totalAmount - ($totalAmount * $discountValue / 100);
        } else {
            $totalAmount = $totalAmount - $discountValue;
        }
        return $totalAmount;
    }

    private function afterTax(float $totalAmount, float $taxRate): float
    {
        $totalAmount = $totalAmount + ($totalAmount * $taxRate / 100);
        return $totalAmount;
    }
}
