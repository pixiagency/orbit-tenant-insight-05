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
 * @property int $id
 * @property string $code
 * @property int $tier_id
 * @property string $source
 * @property string $status
 * @property int $trial_days
 * @property string $expires_at
 * @property \Illuminate\Support\Carbon|null $used_at
 * @property string|null $deleted_at
 * @property int $create_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $createBy
 * @property-read bool $is_expired
 * @property-read bool $is_used
 * @property-read bool $is_valid
 * @property-read \App\Models\Tenant|null $tenant
 * @property-read \App\Models\Tier $tier
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode expired()
 * @method static \Database\Factories\ActivationCodeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode forModuleType(string $moduleType)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode used()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode valid()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereCreateBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereTierId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereTrialDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivationCode whereUsedAt($value)
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
 * @property int $id
 * @property string $name
 * @property int $country_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Country $country
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereCountryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereUpdatedAt($value)
 */
	class City extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string|null $stripe_id
 * @property string $company_name
 * @property string|null $contact_name
 * @property string $contact_email
 * @property string $contact_phone
 * @property string|null $job_title
 * @property string|null $website
 * @property string $subdomain
 * @property string|null $company_size
 * @property string|null $industry
 * @property int $city_id
 * @property string|null $postal_code
 * @property string|null $address
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCompanyName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCompanySize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereContactEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereContactName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereContactPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereIndustry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereJobTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client wherePostalCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereSubdomain($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereWebsite($value)
 */
	class Client extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Location|null $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
 * @property-read \App\Models\Source|null $source
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact query()
 */
	class Contact extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\City> $cities
 * @property-read int|null $cities_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Country whereUpdatedAt($value)
 */
	class Country extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomField query()
 */
	class CustomField extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $code
 * @property int $tier_id
 * @property string $source
 * @property string $status
 * @property int $trial_days
 * @property string $expires_at
 * @property \Illuminate\Support\Carbon|null $used_at
 * @property string $discount_percentage
 * @property string $usage_type
 * @property int|null $max_uses
 * @property string|null $deleted_at
 * @property int $create_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $createBy
 * @property-read bool $is_expired
 * @property-read bool $is_used
 * @property-read bool $is_valid
 * @property-read \App\Models\Tenant|null $tenant
 * @property-read \App\Models\Tier $tier
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode expired()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode forModuleType(string $moduleType)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode used()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode valid()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereCreateBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereDiscountPercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereMaxUses($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereTierId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereTrialDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereUsageType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DiscountCode whereUsedAt($value)
 */
	class DiscountCode extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry query()
 */
	class Industry extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $client_id
 * @property int $subscription_id
 * @property string $amount
 * @property string $status
 * @property string $due_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client|null $client
 * @property-read \App\Models\Subscription|null $subscription
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereSubscriptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereUpdatedAt($value)
 */
	class Invoice extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Contact|null $contact
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomField> $customFields
 * @property-read int|null $custom_fields_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Industry> $industries
 * @property-read int|null $industries_count
 * @property-read \App\Models\Reason|null $reason
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Service> $services
 * @property-read int|null $services_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stage> $stages
 * @property-read int|null $stages_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead query()
 */
	class Lead extends \Eloquent {}
}

namespace App\Models{
/**
 * @property \App\Enums\ActivationStatus $status
 * @property-read \Kalnoy\Nestedset\Collection<int, Location> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Contact> $contacts
 * @property-read int|null $contacts_count
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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stage> $stages
 * @property-read int|null $stages_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pipeline query()
 */
	class Pipeline extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Service query()
 */
	class Service extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property array<array-key, mixed>|null $sources
 * @property array<array-key, mixed>|null $departments
 * @property array<array-key, mixed>|null $industries
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereDepartments($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereIndustries($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereSources($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereUpdatedAt($value)
 */
	class Setting extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Contact> $contacts
 * @property-read int|null $contacts_count
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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
 * @property-read \App\Models\Pipeline|null $pipline
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage filter(\App\Abstracts\QueryFilter $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Stage query()
 */
	class Stage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $client_id
 * @property int $tier_id
 * @property \Illuminate\Support\Carbon|null $subscription_start_date
 * @property \Illuminate\Support\Carbon|null $subscription_end_date
 * @property string $subscription_status
 * @property string $activition_method
 * @property string|null $source
 * @property string $auto_renew
 * @property \App\Enums\landlord\PaymentStatus $payment_status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client $client
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, \Spatie\MediaLibrary\MediaCollections\Models\Media> $media
 * @property-read int|null $media_count
 * @property-read \App\Models\Tier $tier
 * @method static \Database\Factories\SubscriptionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereActivitionMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereAutoRenew($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereSubscriptionEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereSubscriptionStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereSubscriptionStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereTierId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereUpdatedAt($value)
 */
	class Subscription extends \Eloquent implements \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lead> $leads
 * @property-read int|null $leads_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 */
	class Task extends \Eloquent {}
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
 * @property string $id
 * @property string $name
 * @property int|null $client_id
 * @property array<array-key, mixed>|null $data
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenant whereUpdatedAt($value)
 */
	class Tenant extends \Eloquent implements \Stancl\Tenancy\Contracts\TenantWithDatabase, \Spatie\MediaLibrary\HasMedia {}
}

namespace App\Models\Tenant{
/**
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $address
 * @property string|null $phone
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property string|null $trial_ends_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePmLastFour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePmType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTrialEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $package_name
 * @property string|null $description
 * @property float $price
 * @property string $duration_unit
 * @property int $duration
 * @property int $refund_period
 * @property int|null $max_users
 * @property int $max_contacts
 * @property int $storage_limit
 * @property array<array-key, mixed> $modules
 * @property string $status
 * @property string $availability
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Stancl\Tenancy\Database\TenantCollection<int, \App\Models\Tenant> $tenant
 * @property-read int|null $tenant_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier active()
 * @method static \Database\Factories\TierFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereAvailability($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereDurationUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereMaxContacts($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereMaxUsers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereModules($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier wherePackageName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereRefundPeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereStorageLimit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tier withModule(\App\Enums\ModuleType $module)
 */
	class Tier extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $address
 * @property string|null $phone
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property string|null $trial_ends_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePmLastFour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePmType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTrialEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 */
	class User extends \Eloquent {}
}

