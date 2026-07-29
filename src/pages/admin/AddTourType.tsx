import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddTourDialogModal } from "@/components/Modules/Admin/TourTypes/AddTourDialogModal";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
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
import { Card, CardContent } from "@/components/ui/card";

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
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto px-5 ">
        <div className="flex justify-between my-6 items-center">
          <h1 className="text-3xl font-bold tracking-tight">Tour Types</h1>
          <AddTourDialogModal />
        </div>
        <Card className="bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] pl-6">Name</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item: { _id: string; name: string }) => (
                  <TableRow key={item._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="w-full pl-6 font-medium">{item.name}</TableCell>
                    <TableCell className="text-right pr-6">
                      <DeleteConfirmation
                        onConfirm={() => HandleDeleteTourType(item._id)}
                      >
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DeleteConfirmation>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

