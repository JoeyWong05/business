import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

const businessInfoSchema = z.object({
  name: z.string().min(1, { message: 'Business name is required' }),
  type: z.string().min(1, { message: 'Business type is required' }),
  size: z.string().min(1, { message: 'Business size is required' }),
  industry: z.string().min(1, { message: 'Industry is required' }),
  logo: z.string().nullable(),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

export const BusinessInfo: React.FC = () => {
  const { onboardingState, updateBusinessInfo } = useOnboarding();

  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      name: onboardingState.businessInfo.name,
      type: onboardingState.businessInfo.type,
      size: onboardingState.businessInfo.size,
      industry: onboardingState.businessInfo.industry,
      logo: onboardingState.businessInfo.logo,
    },
  });

  const onSubmit = (values: BusinessInfoFormValues) => {
    updateBusinessInfo(values);
  };

  // Auto-save on field change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateBusinessInfo(value as Partial<BusinessInfoFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateBusinessInfo]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={onboardingState.businessInfo.logo || ''} alt="Business Logo" />
              <AvatarFallback className="text-xl">
                {onboardingState.businessInfo.name ? onboardingState.businessInfo.name.charAt(0).toUpperCase() : 'B'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Label htmlFor="logo">Business Logo</Label>
              <Input 
                id="logo" 
                type="file" 
                className="max-w-xs" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateBusinessInfo({ logo: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">Upload your business logo (optional)</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Size</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solo">Solo (1 person)</SelectItem>
                      <SelectItem value="micro">Micro (2-10 employees)</SelectItem>
                      <SelectItem value="small">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                      <SelectItem value="large">Large (250+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                    <SelectItem value="health_wellness">Health & Wellness</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                    <SelectItem value="creative_agency">Creative Agency</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="bg-muted/30 p-4 rounded-lg border mt-6">
        <h4 className="font-medium">Why we need this information</h4>
        <p className="text-sm text-muted-foreground">
          We use your business details to customize dashboards, reports, and recommendations to match your specific needs.
          Your information helps us suggest the right tools and features based on your business type and industry.
        </p>
      </div>
    </div>
  );
};