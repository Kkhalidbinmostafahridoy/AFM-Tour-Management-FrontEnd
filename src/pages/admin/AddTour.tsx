/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddTour() {
  const { data: divisionData } = useGetDivisionTypesQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  const divisionOptions = divisionData?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })
  );

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      division: "",
      tourType: "",
      location: "",
      price: "",
      startDate: null,
      endDate: null,
    },
  });

  const [addTour] = useAddTourMutation();

  const onSubmit = async (data: any) => {
    toast.loading("create loading...");
    try {
      const tourData = {
        ...data,
        startDate: data.startDate ? formatISO(data.startDate) : null,
        endDate: data.endDate ? formatISO(data.endDate) : null,
      };

      const formData = new FormData();
      images.forEach((image) => formData.append("files", image));
      formData.append("data", JSON.stringify(tourData));

      // ✅ Call mutation correctly
      const res = await addTour(formData).unwrap();

      console.log("✅ Tour Created:", res);
      if (res.success) {
        toast.success("Tour Create Successfully...");
      }
      form.reset();
      setImages([]);
      setOpen(false);
    } catch (err) {
      console.error("❌ Failed to create tour:", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" open={open} onChange={setOpen}>
      <CardHeader>
        <CardTitle className="text-2xl underline mx-auto">
          Add New Tour
        </CardTitle>
        <CardDescription className="mx-auto">
          Enter your tour details
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tour Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tour name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Division & Tour Type */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem className="  flex-1">
                    <FormLabel>Division</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisionOptions?.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tourType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tour Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tour type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tourTypeData?.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location & Price */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Start Date & End Date */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full text-left font-normal pl-3",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full text-left font-normal pl-3",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            const today = new Date(
                              new Date().setHours(0, 0, 0, 0)
                            );
                            return !startDate
                              ? date < today
                              : date < new Date(startDate) || date < today;
                          }}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description & Images */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Enter tour description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <MultipleImageUploader onChange={setImages} />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Tour
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
