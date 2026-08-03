/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Trash2,
  Tag,
  Loader2,
  Search,
  Sparkles,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddTourDialogModal } from "@/components/Modules/Admin/TourTypes/AddTourDialogModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
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

interface TourTypeItem {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
}

export function AddTourType() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Live polling every 15s
  const {
    data: rawData,
    isLoading,
    isFetching,
  } = useGetTourTypesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
  });

  const [deleteTourType] = useDeleteTourTypeMutation();

  // Normalize API Data Structure
  const tourTypes: TourTypeItem[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    return rawData?.data || [];
  }, [rawData]);

  // Client-side Search Filter
  const filteredTourTypes = useMemo(() => {
    return tourTypes.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tourTypes, searchTerm]);

  const handleDeleteTourType = async (tourId: string) => {
    setDeletingId(tourId);
    const toastId = toast.loading("Deleting tour type...");
    try {
      const res = await deleteTourType(tourId).unwrap();
      if (res?.success || res) {
        toast.success("Tour type deleted successfully!", { id: toastId });
      } else {
        toast.error("Failed to delete tour type", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tour type", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-[#2a2a2a] bg-gradient-to-r from-[#1c1c1c] via-[#222222] to-[#1c1c1c] p-6 shadow-2xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#e8822a]/10 blur-3xl" />

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e8822a]/30 bg-[#e8822a]/10 text-[#e8822a] shadow-inner">
                <Compass className="h-8 w-8 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Tour Categories
                  </h1>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                    {isFetching && !isLoading ? "Syncing" : "Live"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Manage categories and system classification structures for
                  tour packages.
                </p>
              </div>
            </div>

            <AddTourDialogModal />
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#2a2a2a] pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#171717]/60 p-3">
              <Layers className="h-5 w-5 text-[#e8822a]" />
              <div>
                <p className="text-[11px] text-gray-400">Total Types</p>
                <p className="text-base font-bold text-white">
                  {tourTypes.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#171717]/60 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-[11px] text-gray-400">System Status</p>
                <p className="text-base font-bold text-white">Operational</p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#171717]/60 p-3 sm:col-span-1">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-[11px] text-gray-400">Sync Interval</p>
                <p className="text-base font-bold text-white">15s Auto-fetch</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 border-[#2a2a2a] bg-[#222222] pl-10 text-xs text-white placeholder:text-gray-500 focus-visible:ring-[#e8822a]"
            />
          </div>
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredTourTypes.length}
            </span>{" "}
            of {tourTypes.length} categories
          </p>
        </div>

        {/* Table Container */}
        <Card className="overflow-hidden border border-[#2a2a2a] bg-[#222222] text-gray-200 shadow-2xl">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center justify-between"
                  >
                    <div className="h-6 w-1/3 rounded bg-[#2a2a2a]"></div>
                    <div className="h-8 w-10 rounded-md bg-[#2a2a2a]"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#181818]">
                  <TableRow className="border-b border-[#2a2a2a] hover:bg-transparent">
                    <TableHead className="py-4 pl-6 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Category Name
                    </TableHead>
                    <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-gray-400 sm:table-cell">
                      Slug Identifier
                    </TableHead>
                    <TableHead className="pr-6 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredTourTypes.length > 0 ? (
                      filteredTourTypes.map((item, index) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: index * 0.03 }}
                          className="group border-b border-[#2a2a2a] transition-colors hover:bg-[#1a1a1a]"
                        >
                          <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#e8822a] transition-colors group-hover:border-[#e8822a]/50">
                                <Tag className="h-4 w-4" />
                              </div>
                              <span className="font-semibold text-white">
                                {item.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs text-gray-400 sm:table-cell">
                            <span className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 font-mono text-[11px] text-[#e8822a]">
                              /
                              {item.slug ||
                                item.name.toLowerCase().replace(/\s+/g, "-")}
                            </span>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <DeleteConfirmation
                              onConfirm={() => handleDeleteTourType(item._id)}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={deletingId === item._id}
                                className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              >
                                {deletingId === item._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </DeleteConfirmation>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={3} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-gray-500">
                              <Compass className="h-8 w-8 text-[#e8822a]" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white">
                                No Tour Types Found
                              </h3>
                              <p className="mt-0.5 text-xs text-gray-400">
                                {searchTerm
                                  ? "No categories match your search term."
                                  : "Get started by creating a new category."}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
