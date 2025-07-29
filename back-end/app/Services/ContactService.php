<?php

namespace App\Services;

use App\Models\Tenant\Contact;
use App\QueryFilters\ContactFilters;
use Illuminate\Database\Eloquent\Builder;
use App\DTO\Contact\ContactDTO;

class ContactService extends BaseService
{
    public function __construct(
        public Contact $model,
    ) {}

    public function getModel(): Contact
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
        $contacts = $this->model->with($withRelations)->orderBy('id', 'desc');
        return $contacts->filter(new ContactFilters($filters));
    }

    public function datatable(array $filters = [], array $withRelations = [])
    {
        $contacts = $this->getQuery()->with($withRelations);
        return $contacts->filter(new ContactFilters($filters));
    }

    public function store(ContactDTO $contactDTO)
    {
        $contactData = $contactDTO->toArray();
        // Create the contact
        $contact = $this->model->create($contactData);

        $contact->load('country', 'city', 'user', 'source');
        return $contact;
    }

    public function update(int $id, ContactDTO $contactDTO)
    {
        // Find the contact by ID or fail if not found
        $contact = $this->model->findOrFail($id);
        // Update contact fields
        $contactData = $contactDTO->toArray();
        $contact->update($contactData);
        return $contact;
    }


    public function delete(int $id)
    {
        return $this->getQuery()->where('id', $id)->delete();
    }

    public function getContacts()
    {
        return $this->model->all();
    }

}
