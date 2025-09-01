<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property-read \App\Models\User|null $createBy
 * @property-read bool $is_expired
 * @property-read bool $is_used
 * @property-read bool $is_valid
 * @property-read \App\Models\Tenant|null $tenant
 * @property-read \App\Models\Tier|null $tier
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode expired()
 * @method static \Database\Factories\ActivationCodeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode forModuleType(string $moduleType)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode used()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode valid()
 */
	class ActivationCode extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Service|null $service
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category query()
 */
	class Category extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Country|null $country
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City query()
 */
	class City extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Location|null $area
 * @property-read \App\Models\Source|null $source
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subscription> $subscriptions
 * @property-read int|null $subscriptions_count
 * @method static \Database\Factories\ClientFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client hasExpiredGenericTrial()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client onGenericTrial()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client query()
 */
	class Client extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\City> $cities
 * @property-read int|null $cities_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country query()
 */
	class Country extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Deal> $deals
 * @property-read int|null $deals_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField query()
 */
	class CustomField extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\User|null $createBy
 * @property-read bool $is_expired
 * @property-read bool $is_used
 * @property-read bool $is_valid
 * @property-read \App\Models\Tenant|null $tenant
 * @property-read \App\Models\Tier|null $tier
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode expired()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode forModuleType(string $moduleType)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode used()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode valid()
 */
	class DiscountCode extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry query()
 */
	class Industry extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Client|null $client
 * @property-read \App\Models\Subscription|null $subscription
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice query()
 */
	class Invoice extends \Eloquent {}
}

namespace App\Models{
/**
 * @property \App\Enums\ActivationStatus $status
 * @property-read \Kalnoy\Nestedset\Collection<int, Location> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read Location|null $parent
 * @property-write mixed $parent_id
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location active()
 * @method static \Kalnoy\Nestedset\Collection<int, static> all($columns = ['*'])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location ancestorsAndSelf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location ancestorsOf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location applyNestedSetScope(?string $table = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location cities()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location countErrors()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location countries()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location d()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location defaultOrder(string $dir = 'asc')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location descendantsAndSelf($id, array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location descendantsOf($id, array $columns = [], $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location fixSubtree($root)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location fixTree($root = null)
 * @method static \Kalnoy\Nestedset\Collection<int, static> get($columns = ['*'])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location getNodeData($id, $required = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location getPlainNodeData($id, $required = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location getTotalErrors()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location governorates()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location hasChildren()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location hasParent()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location isBroken()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location leaves(array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location makeGap(int $cut, int $height)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location moveNode($key, $position)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location newModelQuery()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location newQuery()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location orWhereAncestorOf(bool $id, bool $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location orWhereDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location orWhereNodeBetween($values)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location orWhereNotDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location query()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location rebuildSubtree($root, array $data, $delete = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location rebuildTree(array $data, $delete = false, $root = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location reversed()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location root(array $columns = [])
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereAncestorOf($id, $andSelf = false, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereAncestorOrSelf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereDescendantOf($id, $boolean = 'and', $not = false, $andSelf = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereDescendantOrSelf(string $id, string $boolean = 'and', string $not = false)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereIsAfter($id, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereIsBefore($id, $boolean = 'and')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereIsLeaf()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereIsRoot()
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereNodeBetween($values, $boolean = 'and', $not = false, $query = null)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location whereNotDescendantOf($id)
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location withDepth(string $as = 'depth')
 * @method static \Kalnoy\Nestedset\QueryBuilder<static>|Location withoutRoot()
 */
	class Location extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reason filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reason newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reason newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reason query()
 */
	class Reason extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Category> $categories
 * @property-read int|null $categories_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service query()
 */
	class Service extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting query()
 */
	class Setting extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read mixed $image_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, \Spatie\MediaLibrary\MediaCollections\Models\Media> $media
 * @property-read int|null $media_count
 * @method static \Database\Factories\SourceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Source filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Source newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Source newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Source query()
 */
	class Source extends \Eloquent implements \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Tenant\Pipeline|null $pipeline
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage query()
 */
	class Stage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property \App\Enums\landlord\PaymentStatus $payment_status
 * @property-read \App\Models\Client|null $client
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, \Spatie\MediaLibrary\MediaCollections\Models\Media> $media
 * @property-read int|null $media_count
 * @property-read \App\Models\Tier|null $tier
 * @method static \Database\Factories\SubscriptionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription query()
 */
	class Subscription extends \Eloquent implements \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models{
/**
 * @property-read \App\Models\User|null $leader
 * @property-read \App\Models\Location|null $location
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $sales
 * @property-read int|null $sales_count
 * @property-read \App\Models\Source|null $source
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team query()
 */
	class Team extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Stancl\Tenancy\Database\Models\Domain> $domains
 * @property-read int|null $domains_count
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, \Spatie\MediaLibrary\MediaCollections\Models\Media> $media
 * @property-read int|null $media_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tier> $tiers
 * @property-read int|null $tiers_count
 * @property-read \App\Models\User|null $user
 * @method static \Stancl\Tenancy\Database\TenantCollection<int, static> all($columns = ['*'])
 * @method static \Stancl\Tenancy\Database\TenantCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant query()
 */
	class Tenant extends \Eloquent implements \Stancl\Tenancy\Contracts\TenantWithDatabase, \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models\Tenant{
/**
 * @property mixed $value
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AppSetting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AppSetting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AppSetting query()
 */
	class AppSetting extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Lead|null $activeLead
 * @property-read \App\Models\City|null $city
 * @property-read \App\Models\Country|null $country
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Lead> $leads
 * @property-read int|null $leads_count
 * @property-read \App\Models\Source|null $source
 * @property-read \App\Models\Tenant\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact withAnyTag($tags)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact withTag($tag)
 */
	class Contact extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Contact> $contacts
 * @property-read int|null $contacts_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Deal> $deals
 * @property-read int|null $deals_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Lead> $leads
 * @property-read int|null $leads_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField query()
 */
	class CustomField extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Contact|null $contact
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Item> $items
 * @property-read int|null $items_count
 * @property-read \App\Models\Stage|null $stage
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Deal query()
 */
	class Deal extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Deal|null $deal
 * @property-read \App\Models\Tenant\Item|null $item
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DealItem query()
 */
	class DealItem extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\FormAction> $actions
 * @property-read int|null $actions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\FormField> $fields
 * @property-read int|null $fields_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\FormSubmission> $submissions
 * @property-read int|null $submissions_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form query()
 */
	class Form extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Form|null $form
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormAction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormAction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormAction query()
 */
	class FormAction extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Form|null $form
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormField newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormField newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormField query()
 */
	class FormField extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Form|null $form
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormSubmission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormSubmission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FormSubmission query()
 */
	class FormSubmission extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Deal> $deals
 * @property-read int|null $deals_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item query()
 */
	class Item extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Item> $items
 * @property-read int|null $items_count
 * @method static \Database\Factories\Tenant\ItemCategoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCategory filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCategory query()
 */
	class ItemCategory extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Item> $items
 * @property-read int|null $items_count
 * @method static \Database\Factories\Tenant\ItemStatusFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemStatus filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemStatus query()
 */
	class ItemStatus extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\City|null $city
 * @property-read \App\Models\Tenant\Contact|null $contact
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomField> $customFields
 * @property-read int|null $custom_fields_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Industry> $industries
 * @property-read int|null $industries_count
 * @property-read \App\Models\Reason|null $reason
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Service> $services
 * @property-read int|null $services_count
 * @property-read \App\Models\Stage|null $stage
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stage> $stages
 * @property-read int|null $stages_count
 * @property-read \App\Models\Tenant\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead query()
 */
	class Lead extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentMethod newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentMethod newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PaymentMethod query()
 */
	class PaymentMethod extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stage> $stages
 * @property-read int|null $stages_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline query()
 */
	class Pipeline extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \App\Models\Tenant\Deal|null $deal
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SubscriptionDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SubscriptionDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SubscriptionDetail query()
 */
	class SubscriptionDetail extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\User> $followers
 * @property-read int|null $followers_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenant\Lead> $leads
 * @property-read int|null $leads_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 */
	class Task extends \Eloquent {}
}

namespace App\Models\Tenant{
/**
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * @property mixed $modules
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subscription> $subscriptions
 * @property-read int|null $subscriptions_count
 * @property-read \Stancl\Tenancy\Database\TenantCollection<int, \App\Models\Tenant> $tenant
 * @property-read int|null $tenant_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier active()
 * @method static \Database\Factories\TierFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier withModule(\App\Enums\ModuleType $module)
 */
	class Tier extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \App\Models\Tenant|null $tenant
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 */
	class User extends \Eloquent {}
}

