/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import { useAddTourTypeMutation } from "@/redux/features/Tour/tour.api";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// export function AddTourDialogModal() {
//   const form = useForm<{ name: string }>({
//     defaultValues: { name: "" },
//   });
//   const [addTourType] = useAddTourTypeMutation();
//   const [open, setOpen] = useState(false);

//   const onSubmit = async (data: { name: string }) => {
//     try {
//       await addTourType({ name: data.name }).unwrap();
//       toast.success("Tour Type Added");
//       form.reset();
//       // Only close modal after success
//       setOpen(false);
//     } catch (error) {
//       toast.error("❌ Failed to add Tour Type");
//       // Keep modal open
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Tour Type</Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="mx-auto text-[16px]">
//             Add Tour Type
//           </DialogTitle>
//           <DialogDescription className="text-purple-500 mx-auto">
//             Enter your new{" "}
//             <span className="text-xl text-red-400 font-medium">Tour Type</span>{" "}
//             below & enjoy...
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form id="addTourType" onSubmit={form.handleSubmit(onSubmit)}>
//             <FormField
//               control={form.control}
//               name="name"
//               rules={{ required: "Tour Type Name is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Tour Type Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Adventure" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DialogClose>
//           <Button type="submit" form="addTourType">
//             Save
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { Loader2, PlusCircle, Compass } from "lucide-react";

export function AddTourDialogModal() {
  const form = useForm<{ name: string }>({
    defaultValues: { name: "" },
  });

  // Extract isLoading to handle button spinner state
  const [addTourType, { isLoading }] = useAddTourTypeMutation();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: { name: string }) => {
    const toastId = toast.loading("Creating tour type...");

    try {
      await addTourType({ name: data.name }).unwrap();
      toast.success("Tour Type added successfully!", { id: toastId });

      // Reset form and close modal on success
      form.reset();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      // Extract backend error message safely
      toast.error(error?.data?.message || "Failed to add Tour Type", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Reset form state if user manually closes the modal
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Tour Type
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] bg-card/80 border-border/40 backdrop-blur-2xl shadow-2xl rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Create New Tour Type
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter a name for your new tour category below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="addTourTypeForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Tour Type Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Tour Type Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Adventure, Beach, Historical"
                      className="bg-background/50 border-border/60 focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            form="addTourTypeForm"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Tour Type"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
