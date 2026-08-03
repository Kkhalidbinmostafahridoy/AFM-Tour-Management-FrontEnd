/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { PageWrapper } from "@/components/layout/PageWrapper";
// import MultipleImageUploader from "@/components/MultipleImageUploader";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
// import {
//   useAddTourMutation,
//   useGetTourTypesQuery,
// } from "@/redux/features/Tour/tour.api";
// import { format, formatISO } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// export function AddTour() {
//   const { data: divisionData } = useGetDivisionTypesQuery(undefined);
//   const { data: tourTypeData } = useGetTourTypesQuery(undefined);
//   const [images, setImages] = useState<File[]>([]);

//   const divisionOptions = divisionData?.data?.map(
//     (item: { _id: string; name: string }) => ({
//       value: item._id,
//       label: item.name,
//     })
//   );

//   const form = useForm({
//     defaultValues: {
//       title: "",
//       description: "",
//       division: "",
//       tourType: "",
//       location: "",
//       price: "",
//       startDate: null,
//       endDate: null,
//     },
//   });

//   const [addTour] = useAddTourMutation(undefined);

//   const onSubmit = async (data: any) => {
//     // Show loading toast and store ID
//     const toastId = toast.loading("Creating tour...");

//     try {
//       // Prepare tour data
//       const tourData = {
//         ...data,
//         startDate: data.startDate ? formatISO(data.startDate) : null,
//         endDate: data.endDate ? formatISO(data.endDate) : null,
//       };

//       // Append images and tour data to FormData
//       const formData = new FormData();
//       images.forEach((image) => formData.append("files", image));
//       formData.append("data", JSON.stringify(tourData));

//       // Call the API mutation
//       const res = await addTour(formData).unwrap();

//       if (res.success) {
//         // Dismiss loading toast and show success
//         toast.dismiss(toastId);
//         toast.success("Tour created successfully!");

//         // Reset form and images
//         form.reset();
//         setImages([]);

//         console.log("Create a database in Successfully:", res.data);
//       }
//     } catch (err) {
//       // Dismiss loading and show error
//       toast.dismiss(toastId);
//       console.error("Failed to create tour:", err);
//       toast.error("Failed to create tour!");
//     }
//   };

//   return (
//     <PageWrapper>
//       <Card className="w-full max-w-2xl mx-auto bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50 shadow-lg mt-4 mb-8">
//         <CardHeader>
//         <CardTitle className="text-2xl underline mx-auto text-amber-700">
//           Add New Tour
//         </CardTitle>
//         <CardDescription className="mx-auto text-blue-400">
//           Enter your tour details
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Tour Title */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Tour Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter tour name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Division & Tour Type */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <FormField
//                 control={form.control}
//                 name="division"
//                 render={({ field }) => (
//                   <FormItem className="  flex-1">
//                     <FormLabel>Division</FormLabel>
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select division" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {divisionOptions?.map((item: any) => (
//                           <SelectItem key={item.value} value={item.value}>
//                             {item.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="tourType"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>Tour Type</FormLabel>
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select tour type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {tourTypeData?.map((item: any) => (
//                           <SelectItem key={item._id} value={item._id}>
//                             {item.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Location & Price */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <FormField
//                 control={form.control}
//                 name="location"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>Location</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter location" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>Price</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Enter price"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Start Date & End Date */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>Start Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             "w-full text-left font-normal pl-3",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value
//                             ? format(field.value, "PPP")
//                             : "Pick a date"}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={
//                             field.value ? new Date(field.value) : undefined
//                           }
//                           onSelect={field.onChange}
//                           disabled={(date) =>
//                             date < new Date(new Date().setHours(0, 0, 0, 0))
//                           }
//                           captionLayout="dropdown"
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="endDate"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>End Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             "w-full text-left font-normal pl-3",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value
//                             ? format(field.value, "PPP")
//                             : "Pick a date"}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={
//                             field.value ? new Date(field.value) : undefined
//                           }
//                           onSelect={field.onChange}
//                           disabled={(date) => {
//                             const startDate = form.getValues("startDate");
//                             const today = new Date(
//                               new Date().setHours(0, 0, 0, 0)
//                             );
//                             return !startDate
//                               ? date < today
//                               : date < new Date(startDate) || date < today;
//                           }}
//                           captionLayout="dropdown"
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Description & Images */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem className="h-full">
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <textarea
//                           {...field}
//                           className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
//                           placeholder="Enter tour description"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="flex-1">
//                 <MultipleImageUploader onChange={setImages} />
//               </div>
//             </div>

//             <Button type="submit" className="w-full">
//               Create Tour
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//     </PageWrapper>
//   );
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, formatISO } from "date-fns";
import { toast } from "sonner";
import {
  CalendarIcon,
  Compass,
  MapPin,
  Tag,
  DollarSign,
  Calendar as CalendarIconLucide,
  FileText,
  Loader2,
  PlusCircle,
  Sparkles,
} from "lucide-react";

import { PageWrapper } from "@/components/layout/PageWrapper";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
import {
  useAddTourMutation,
  useGetTourTypesQuery,
} from "@/redux/features/Tour/tour.api";

// --- FORM VALIDATION SCHEMA ---
const addTourSchema = z.object({
  title: z.string().min(3, "Tour title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  division: z.string().min(1, "Please select a division"),
  tourType: z.string().min(1, "Please select a tour type"),
  location: z.string().min(2, "Location is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid positive number",
    }),
  startDate: z.date(),
  endDate: z.date(),
});

type AddTourFormValues = z.infer<typeof addTourSchema>;

export function AddTour() {
  const { data: divisionData } = useGetDivisionTypesQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);
  const [images, setImages] = useState<File[]>([]);

  // Safe extractors for options dropdowns
  const divisionOptions =
    divisionData?.data?.map((item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })) || [];

  const tourTypeOptions =
    tourTypeData?.data?.map((item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })) ||
    (Array.isArray(tourTypeData)
      ? tourTypeData.map((item: any) => ({
          value: item._id,
          label: item.name,
        }))
      : []);

  const form = useForm<AddTourFormValues>({
    resolver: zodResolver(addTourSchema),
    defaultValues: {
      title: "",
      description: "",
      division: "",
      tourType: "",
      location: "",
      price: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const [addTour, { isLoading: isSubmitting }] = useAddTourMutation();

  const onSubmit = async (data: AddTourFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image for the tour!");
      return;
    }

    const toastId = toast.loading("Creating tour package...");

    try {
      // Structure tour data payload
      const tourPayload = {
        title: data.title,
        description: data.description,
        division: data.division,
        tourType: data.tourType,
        location: data.location,
        price: Number(data.price),
        startDate: formatISO(data.startDate),
        endDate: formatISO(data.endDate),
      };

      // Append files and JSON payload to Multipart FormData
      const formData = new FormData();
      images.forEach((image) => formData.append("files", image));
      formData.append("data", JSON.stringify(tourPayload));

      const res = await addTour(formData).unwrap();

      if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
        toast.dismiss(toastId);
        toast.success("Tour created successfully!");

        // Reset form state
        form.reset();
        setImages([]);
      } else {
        toast.dismiss(toastId);
        toast.error(res?.message || "Failed to create tour package!");
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      console.error("Failed to create tour:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to create tour!",
      );
    }
  };

  return (
    <PageWrapper>
      <div className="py-6">
        <Card className="mx-auto w-full max-w-3xl border border-[#2a2a2a] bg-[#222222] text-gray-200 shadow-2xl">
          <CardHeader className="border-b border-[#2a2a2a] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8822a]/10 text-[#e8822a]">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-tight">
                  Add New Tour Package
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Publish a new tour offering to the travel catalog
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Tour Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        Tour Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sundarbans Wildlife & Forest Adventure"
                          {...field}
                          className="h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Division & Tour Type */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
                          Division
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white focus:border-[#e8822a]">
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent className="border-[#3a3a3a] bg-[#222222] text-xs text-gray-200">
                            {divisionOptions.map((item: any) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                                className="focus:bg-[#1a1a1a] focus:text-white"
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11px] text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tourType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
                          Tour Type
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white focus:border-[#e8822a]">
                            <SelectValue placeholder="Select tour type" />
                          </SelectTrigger>
                          <SelectContent className="border-[#3a3a3a] bg-[#222222] text-xs text-gray-200">
                            // eslint-disable-next-line
                            @typescript-eslint/no-explicit-any
                            {tourTypeOptions.map((item: any) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                                className="focus:bg-[#1a1a1a] focus:text-white"
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11px] text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location & Price */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
                          Location / Spot
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                            <Input
                              placeholder="e.g. Cox's Bazar, Bangladesh"
                              {...field}
                              className="h-10 border-[#3a3a3a] bg-[#1a1a1a] pl-9 text-xs text-white placeholder-gray-500 focus:border-[#e8822a]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
                          Price per Person (BDT ৳)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                              ৳
                            </span>
                            <Input
                              type="number"
                              placeholder="5500"
                              {...field}
                              className="h-10 border-[#3a3a3a] bg-[#1a1a1a] pl-8 text-xs text-white placeholder-gray-500 focus:border-[#e8822a]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start Date & End Date */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-300">
                          Start Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-10 w-full justify-between border-[#3a3a3a] bg-[#1a1a1a] px-3 text-left text-xs font-normal text-white hover:bg-[#222222]",
                                !field.value && "text-gray-500",
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick start date"}
                              <CalendarIcon className="h-4 w-4 text-[#e8822a]" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto border-[#3a3a3a] bg-[#222222] p-0 text-white"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              className="bg-[#222222] text-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-[11px] text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-300">
                          End Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-10 w-full justify-between border-[#3a3a3a] bg-[#1a1a1a] px-3 text-left text-xs font-normal text-white hover:bg-[#222222]",
                                !field.value && "text-gray-500",
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick end date"}
                              <CalendarIcon className="h-4 w-4 text-[#e8822a]" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto border-[#3a3a3a] bg-[#222222] p-0 text-white"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                const today = new Date(
                                  new Date().setHours(0, 0, 0, 0),
                                );
                                return !startDate
                                  ? date < today
                                  : date < new Date(startDate) || date < today;
                              }}
                              initialFocus
                              className="bg-[#222222] text-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-[11px] text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        Tour Overview & Itinerary
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:outline-none"
                          placeholder="Provide a comprehensive breakdown of the tour itinerary, inclusions, and guidelines..."
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Multiple Image Uploader Container */}
                <div className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      Tour Gallery Images
                    </span>
                    <span className="text-[10px] text-gray-500">
                      At least 1 image required
                    </span>
                  </div>
                  <MultipleImageUploader onChange={setImages} />
                </div>

                {/* Action Controls */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl bg-[#e8822a] text-xs font-bold text-white shadow-lg shadow-[#e8822a]/20 transition hover:bg-[#d07323] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Publishing Tour...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Tour Package
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
