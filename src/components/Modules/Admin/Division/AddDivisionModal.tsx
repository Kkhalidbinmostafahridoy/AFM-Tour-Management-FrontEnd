/* eslint-disable @typescript-eslint/no-explicit-any */
// import SingleImageUploader from "@/components/SingleImageUploader";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useAddDivisionMutation } from "@/redux/features/division/division.api";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// export function AddDivisionModal() {
//   const [image, setImage] = useState<File | null>(null);

//   console.log("add modal", image);
//   const form = useForm({
//     defaultValues: { name: "", description: "" },
//   });
//   const [open, setOpen] = useState(false);
//   const [addDivision] = useAddDivisionMutation();

//   const onSubmit = async (data: any) => {
//     const toastId = toast.loading("file uploaded loading....");
//     try {
//       console.log(data);

//       const formData = new FormData();

//       formData.append("data", JSON.stringify(data));
//       formData.append("file", image as File);

//       const res = await addDivision(formData).unwrap();
//       console.log(res);
//       toast.success("division Added successfully done", { id: toastId });
//       setOpen(false);
//     } catch (error) {
//       toast.error(" Failed to add Tour Type");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Division</Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="mx-auto text-[16px]">
//             Add Division
//           </DialogTitle>
//           <DialogDescription className="text-purple-500 mx-auto">
//             Enter your new{" "}
//             <span className="text-xl text-red-400 font-medium">Division</span>{" "}
//             below & enjoy...
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             className="space-y-4"
//             id="addDivision"
//             onSubmit={form.handleSubmit(onSubmit)}
//           >
//             <FormField
//               control={form.control}
//               name="name"
//               rules={{ required: "Division Type Name is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Division Type</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Adventure" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="description"
//               rules={{ required: "Division Type description is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Division Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="type your tour Description"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//           <SingleImageUploader onChange={setImage} />
//         </Form>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DialogClose>
//           <Button disabled={!image} type="submit" form="addDivision">
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { Loader2, PlusCircle, MapPinPlus } from "lucide-react";

// Define form values type for 0 errors
interface DivisionFormValues {
  name: string;
  description: string;
}

export function AddDivisionModal() {
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<DivisionFormValues>({
    defaultValues: { name: "", description: "" },
  });

  // RTK Query mutation hook - isLoading handles the button spinner
  const [addDivision, { isLoading }] = useAddDivisionMutation();

  const onSubmit = async (data: DivisionFormValues) => {
    if (!image) {
      toast.error("Please upload an image for the division.");
      return;
    }

    const toastId = toast.loading("Creating division...");
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("file", image);

      // unwrap() ensures we catch backend errors properly
      await addDivision(formData).unwrap();

      toast.success("Division added successfully!", { id: toastId });

      // Reset form and image state for next time
      form.reset();
      setImage(null);
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add division", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Reset state if user manually closes the modal
        if (!isOpen) {
          form.reset();
          setImage(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Division
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-card/80 border-border/40 backdrop-blur-2xl shadow-2xl rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MapPinPlus className="h-5 w-5 text-primary" />
            Create New Division
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to add a new geographic division.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-5 pt-2"
            id="addDivisionForm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Division name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Division Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Chittagong"
                      className="bg-background/50 border-border/60 focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the division..."
                      className="resize-none bg-background/50 border-border/60 focus-visible:ring-primary/50 min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Uploader integrated cleanly into the form flow */}
            <div className="space-y-2">
              <FormLabel className="text-foreground font-medium">
                Thumbnail Image
              </FormLabel>
              <SingleImageUploader onChange={setImage} />
              {!image && (
                <p className="text-xs text-muted-foreground">
                  An image is required to create a division.
                </p>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/40 mt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="addDivisionForm"
            disabled={isLoading || !image}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Division"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
