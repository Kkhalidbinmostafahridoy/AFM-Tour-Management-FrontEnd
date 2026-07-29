import SingleImageUploader from "@/components/SingleImageUploader";
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
import { Textarea } from "@/components/ui/textarea";
import { useAddDivisionMutation } from "@/redux/features/division/division.api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddDivisionModal() {
  const [image, setImage] = useState<File | null>(null);

  console.log("add modal", image);
  const form = useForm({
    defaultValues: { name: "", description: "" },
  });
  const [open, setOpen] = useState(false);
  const [addDivision] = useAddDivisionMutation();

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("file uploaded loading....");
    try {
      console.log(data);

      const formData = new FormData();

      formData.append("data", JSON.stringify(data));
      formData.append("file", image as File);

      const res = await addDivision(formData).unwrap();
      console.log(res);
      toast.success("division Added successfully done", { id: toastId });
      setOpen(false);
    } catch (error) {
      toast.error(" Failed to add Tour Type");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Division</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mx-auto text-[16px]">
            Add Division
          </DialogTitle>
          <DialogDescription className="text-purple-500 mx-auto">
            Enter your new{" "}
            <span className="text-xl text-red-400 font-medium">Division</span>{" "}
            below & enjoy...
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            id="addDivision"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Division Type Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Adventure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Division Type description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="type your tour Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <SingleImageUploader onChange={setImage} />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!image} type="submit" form="addDivision">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
