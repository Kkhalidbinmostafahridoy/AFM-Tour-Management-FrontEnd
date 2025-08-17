// import { AddTourDialogModal } from "@/components/Modules/Admin/TourTypes/AddTourDialogModal";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   useDeleteTourTypeMutation,
//   useGetTourTypesQuery,
// } from "@/redux/features/Tour/tour.api";
// import { Trash2 } from "lucide-react";

// function AddTourType() {
//   const [deleteTourType] = useDeleteTourTypeMutation();
//   const DeleteTour = async (_id: string) => {
//     await deleteTourType("689898e5c6ba8b4832cf1829").unwrap();
//     console.log("689898e5c6ba8b4832cf1829");
//   };

//   const { data } = useGetTourTypesQuery(undefined);
//   console.log(data);
//   return (
//     <div className="w-full max-w-7xl mx-auto px-5 ">
//       <div className=" flex justify-between my-6">
//         <h1 className="text-2xl font-semibold">Tour Types</h1>
//         <Button>
//           <AddTourDialogModal />
//         </Button>
//       </div>
//       <div className="border-2 border-muted rounded-md border-s-amber-100 border-b-amber-300 border-e-amber-300 border-y-purple-600">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[100px]">Name</TableHead>
//               <TableHead className="text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data?.map((item: { name: string }) => (
//               <TableRow>
//                 <TableCell className="w-full">{item?.name}</TableCell>
//                 <TableCell>
//                   <Button
//                     onClick={() => DeleteTour("689898e5c6ba8b4832cf1829")}
//                     size="sm"
//                   >
//                     <Trash2 />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
// export default AddTourType;

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
  const [deleteTourType] = useDeleteTourTypeMutation();

  const DeleteTour = async (id: string) => {
    try {
      await deleteTourType(id).unwrap();
      if (data.success) {
        toast.success("Tour Type Deleted");
      } else {
        toast.error("Error Deleting Tour Type");
      }
      console.log(`${id} deleted`);
    } catch (err) {
      console.error("Delete failed:", err);
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
              <TableRow key={item._id}>
                <TableCell className="w-full">{item.name}</TableCell>
                <TableCell>
                  <Button onClick={() => DeleteTour(item._id)} size="sm">
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
