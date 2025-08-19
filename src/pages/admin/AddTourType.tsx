import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddTourDialogModal } from "@/components/Modules/Admin/TourTypes/AddTourDialogModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteTourTypeMutation,
  useGetTourTypesQuery,
} from "@/redux/features/Tour/tour.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function AddTourType() {
  const { data } = useGetTourTypesQuery(undefined);
  const [deleteTourType] = useDeleteTourTypeMutation(undefined);

  const HandleDeleteTourType = async (tourId: string) => {
    const toastId = toast.loading("Deleted...");
    try {
      const res = await deleteTourType(tourId).unwrap();
      if (res.success) {
        toast.success("Tour Type Deleted Successfully", { id: toastId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 ">
      <div className="flex justify-between my-6">
        <h1 className="text-2xl font-semibold">Tour Types</h1>
        <Button>
          <AddTourDialogModal />
        </Button>
      </div>
      <div className="border-2 border-muted rounded-md border-s-amber-100 border-b-amber-300 border-e-amber-300 border-y-purple-600">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: { _id: string; name: string }) => (
              <TableRow>
                <TableCell className="w-full">{item.name}</TableCell>
                <TableCell>
                  <DeleteConfirmation
                    onConfirm={() => HandleDeleteTourType(item._id)}
                  >
                    <Button>
                      <Trash2 />
                    </Button>
                  </DeleteConfirmation>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
