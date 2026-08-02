// import { AddDivisionModal } from "@/components/Modules/Admin/Division/AddDivisionModal";
// import { Button } from "@/components/ui/button";
// import { PageWrapper } from "@/components/layout/PageWrapper";
// import { Card, CardContent } from "@/components/ui/card";
// import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// export default function AddDivision() {
//   const { data } = useGetDivisionTypesQuery(undefined);

//   return (
//     <PageWrapper>
//       <div className="w-full max-w-7xl mx-auto px-5">
//         <div className="flex justify-between my-6 items-center">
//           <h1 className="text-3xl font-bold tracking-tight">Divisions</h1>
//           <Button asChild>
//             <AddDivisionModal />
//           </Button>
//         </div>

//         <Card className="bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50 shadow-sm mt-4">
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-full pl-6">Division Name</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {data?.data?.map((item: { _id: string; name: string }) => (
//                   <TableRow key={item._id} className="hover:bg-muted/50 transition-colors">
//                     <TableCell className="w-full pl-6 font-medium">{item.name}</TableCell>
//                   </TableRow>
//                 ))}
//                 {!data?.data?.length && (
//                   <TableRow>
//                     <TableCell className="text-center py-8 text-muted-foreground">
//                       No divisions found. Add one to get started!
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </PageWrapper>
//   );
// }

import { AddDivisionModal } from "@/components/Modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ImageOff, Pencil, Loader2, Trash2 } from "lucide-react";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";

export default function AddDivision() {
  // Polling interval added for LIVE data sync every 15 seconds
  const { data, isLoading, isFetching } = useGetDivisionTypesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      // TODO: wire up actual delete mutation when available
      console.log("Delete division", id);
    } finally {
      setIsDeleting(false);
    }
  };

  const divisions = data?.data || [];

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto px-5 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between md:items-center my-6 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Divisions
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live sync{" "}
                {isFetching && !isLoading ? "- Updating..." : "- Active"}
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
          >
            <AddDivisionModal />
          </Button>
        </motion.div>

        {/* Table Card */}
        <Card className="bg-background/50 backdrop-blur-xl border-white/20 dark:border-gray-800/50 shadow-sm mt-4 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-6 p-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 animate-pulse"
                  >
                    <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                    <TableHead className="pl-6 w-[100px]">Image</TableHead>
                    <TableHead>Division Name</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divisions.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    divisions.map((item: any, index: number) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="contents"
                      >
                        <TableRow className="group hover:bg-muted/40 transition-colors duration-200 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                          <TableCell className="pl-6 py-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <ImageOff className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-gray-800 dark:text-gray-100 text-base">
                            {item.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">
                              /
                              {item.slug ||
                                item.name.toLowerCase().replace(/\s+/g, "-")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              {/* You can wire this to an Edit Modal if you have one */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>

                              <DeleteConfirmation
                                onConfirm={() => handleDelete(item._id)}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isDeleting}
                                  className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </DeleteConfirmation>
                            </div>
                          </TableCell>
                        </TableRow>
                      </motion.div>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                            <MapPin className="w-10 h-10 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                              No divisions found
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Add a new division to get started!
                            </p>
                          </div>
                          <Button
                            asChild
                            className="mt-4 bg-blue-600 hover:bg-blue-700"
                          >
                            <AddDivisionModal />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
