<?php

namespace App\Services\Tenant;

use App\Exceptions\GeneralException;
use App\Models\Tenant\Item;
use Illuminate\Database\Eloquent\Builder;
use App\DTO\Item\ItemDTO;
use App\Enums\ItemType;
use App\Models\Filters\ItemFilter;
use App\Models\Tenant\ItemAttribute;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class ItemService extends BaseService
{
    public function __construct(
        public Item $model,
        public ItemAttribute $itemAttribute,
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
        return $items->filter(new ItemFilter($filters));
    }

    public function index(array $filters = [], array $withRelations = [], ?int $perPage = null)
    {
        $query = $this->queryGet(filters: $filters, withRelations: $withRelations);
        if ($perPage) {
            return $query->paginate($perPage);
        }
        return $query->get();
    }

    public function store(ItemDTO $itemDTO): Item | array | bool
    {
        if ($itemDTO->type == ItemType::SERVICE->value) {
            $itemDTO->quantity = null;
            $itemDTO->sku = null;
            $item = $this->model->create($itemDTO->toArray());
            return $item;
        } elseif ($itemDTO->type == ItemType::PRODUCT->value) {
            $itemDTO->duration = null;
            $createdItems = [];

            foreach ($itemDTO->variants as $variantData) {
                if ($this->checkDuplicateAttributes($variantData['attributes'])) {
                    throw new GeneralException('The selected attributes field contains duplicate values.');
                }
                $item = $this->createItemVariant($itemDTO->toArray(), $variantData);
                $createdItems[] = $item;
            }
            return $createdItems;
        }

        return false;
    }


    private function createItemVariant(array $baseData, array $variantData): Item
    {
        // Generate unique SKU for this variant
        $variantSku = Item::generateVariantSku(
            $baseData['sku'],
            $variantData['attributes']
        );

        // Ensure SKU is unique by appending number if needed
        $originalSku = $variantSku;
        $counter = 1;
        while (Item::where('sku', $variantSku)->exists()) {
            $variantSku = $originalSku . '-' . $counter;
            $counter++;
        }

        return Item::create([
            'name' => $baseData['name'],
            'description' => $baseData['description'],
            'sku' => $variantSku,
            'attributes' => $variantData['attributes'],
            'price' => $variantData['price'],
            'quantity' => $variantData['quantity'],
            'duration' => $baseData['duration'] ?? null,
            'category_id' => $baseData['category_id'],
            'type' => $baseData['type']
        ]);
    }

    private function checkDuplicateAttributes(array $attributes): bool
    {
        return Item::where('type', ItemType::PRODUCT->value)
            ->whereJsonContains('attributes', $attributes)              // has both values
            ->whereJsonLength('attributes', count($attributes))         // and nothing else
            ->exists();
    }

    public function update(int $id, ItemDTO $itemDTO): Item
    {
        try {
            DB::beginTransaction();
            $item = $this->findById($id);
            DB::commit();
            return $item->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new GeneralException('Failed to update priority: ' . $e->getMessage());
        }
    }

    public function destroy(int $id): bool
    {
        $item = $this->findById($id);
        if ($item->opportunities()->exists()) {
            throw new GeneralException(__('app.cannot_delete_item_used_by_opportunities'));
        }
        $result = $item->delete();
        return $result;
    }

    public function getAttributes()
    {
        return $this->itemAttribute->ordered()->get();
    }

    public function getAttribute(string $attribute)
    {
        return $this->itemAttribute->where('name', $attribute)->get();
    }

    public function storeAttributes(array $data)
    {
        return $this->itemAttribute->create($data);
    }

    public function destroyAttributes(string $attribute)
    {
        $attribute = $this->itemAttribute->where('name', $attribute)->first();
        if ($attribute->items()->exists()) {
            throw new GeneralException(__('app.cannot_delete_attribute_used_by_items_or_products'));
        }
        return $attribute->delete();
    }
}
