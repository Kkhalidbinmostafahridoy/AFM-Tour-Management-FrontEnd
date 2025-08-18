import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddTourTypeMutation } from "@/redux/features/Tour/tour.api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddTourDialogModal() {
  const form = useForm<{ name: string }>();
  const [addTourType] = useAddTourTypeMutation();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: { name: string }) => {
    try {
      await addTourType({ name: data.name }).unwrap();
      toast.success("Tour Type Added");
      form.reset();
      // Only close modal after success
      setOpen(false);
    } catch (error) {
      toast.error("❌ Failed to add Tour Type");
      // Keep modal open
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Tour Type</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mx-auto text-[16px]">
            Add Tour Type
          </DialogTitle>
          <DialogDescription className="text-purple-500 mx-auto">
            Enter your new{" "}
            <span className="text-xl text-red-400 font-medium">Tour Type</span>{" "}
            below & enjoy...
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="addTourType" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Tour Type Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Adventure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="addTourType">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
