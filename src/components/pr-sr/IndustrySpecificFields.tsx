import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface IndustrySpecificFieldsProps {
  industry: string;
  register: any;
  setValue: any;
  watch: any;
}

export const IndustrySpecificFields: React.FC<IndustrySpecificFieldsProps> = ({
  industry,
  register,
  setValue,
  watch
}) => {
  const renderRealEstateFields = () => (
    <div className="space-y-4">
      <h5 className="font-medium text-muted-foreground">Real Estate Specific</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="property_type">Property Type</Label>
          <Select onValueChange={(value) => setValue('custom_fields.property_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="mixed_use">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="square_footage">Square Footage</Label>
          <Input
            {...register('custom_fields.square_footage')}
            type="number"
            placeholder="Square feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            {...register('custom_fields.bedrooms')}
            type="number"
            placeholder="Number of bedrooms"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            {...register('custom_fields.bathrooms')}
            type="number"
            step="0.5"
            placeholder="Number of bathrooms"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_built">Year Built</Label>
          <Input
            {...register('custom_fields.year_built')}
            type="number"
            placeholder="Year built"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lot_size">Lot Size</Label>
          <Input
            {...register('custom_fields.lot_size')}
            placeholder="Lot size (acres/sqft)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="property_features">Property Features</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Pool', 'Garage', 'Fireplace', 'Balcony', 'Garden', 'Elevator'].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked) => {
                  const currentFeatures = watch('custom_fields.property_features') || [];
                  const updatedFeatures = checked
                    ? [...currentFeatures, feature]
                    : currentFeatures.filter((f: string) => f !== feature);
                  setValue('custom_fields.property_features', updatedFeatures);
                }}
              />
              <Label className="text-sm">{feature}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_details">Location Details</Label>
        <Textarea
          {...register('custom_fields.location_details')}
          placeholder="Neighborhood, nearby amenities, transportation..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderAutomotiveFields = () => (
    <div className="space-y-4">
      <h5 className="font-medium text-muted-foreground">Automotive Specific</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input {...register('custom_fields.make')} placeholder="Vehicle make" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input {...register('custom_fields.model')} placeholder="Vehicle model" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input {...register('custom_fields.year')} type="number" placeholder="Year" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input {...register('custom_fields.mileage')} type="number" placeholder="Mileage" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_type">Fuel Type</Label>
          <Select onValueChange={(value) => setValue('custom_fields.fuel_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select onValueChange={(value) => setValue('custom_fields.transmission', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderHealthcareFields = () => (
    <div className="space-y-4">
      <h5 className="font-medium text-muted-foreground">Healthcare Specific</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medical_category">Medical Category</Label>
          <Select onValueChange={(value) => setValue('custom_fields.medical_category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equipment">Medical Equipment</SelectItem>
              <SelectItem value="pharmaceutical">Pharmaceutical</SelectItem>
              <SelectItem value="diagnostic">Diagnostic</SelectItem>
              <SelectItem value="therapeutic">Therapeutic</SelectItem>
              <SelectItem value="surgical">Surgical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fda_approved">FDA Approved</Label>
          <Select onValueChange={(value) => setValue('custom_fields.fda_approved', value === 'true')}>
            <SelectTrigger>
              <SelectValue placeholder="FDA Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prescription_required">Prescription Required</Label>
          <Select onValueChange={(value) => setValue('custom_fields.prescription_required', value === 'true')}>
            <SelectTrigger>
              <SelectValue placeholder="Prescription Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Required</SelectItem>
              <SelectItem value="false">Not Required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage/Specifications</Label>
          <Input
            {...register('custom_fields.dosage')}
            placeholder="Dosage or technical specifications"
          />
        </div>
      </div>
    </div>
  );

  const renderFields = () => {
    switch (industry?.toLowerCase()) {
      case 'real estate':
        return renderRealEstateFields();
      case 'automotive':
        return renderAutomotiveFields();
      case 'healthcare':
        return renderHealthcareFields();
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4">Industry-Specific Fields</h4>
      {renderFields() || (
        <p className="text-muted-foreground text-sm">
          No industry-specific fields available for "{industry}". 
          Select an industry to see custom fields.
        </p>
      )}
    </div>
  );
};