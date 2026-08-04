import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ImageOff,
  Pencil,
  Loader2,
  Trash2,
  Search,
  Globe2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { AddDivisionModal } from "@/components/Modules/Admin/Division/AddDivisionModal";
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
  useGetDivisionTypesQuery,
  useDeleteDivisionMutation,
} from "@/redux/features/division/division.api";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";

// TypeScript Interface
interface DivisionItem {
  _id: string;
  name: string;
  slug?: string;
  thumbnail?: string;
  createdAt?: string;
}

export default function AddDivision() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Live polling interval for real-time data sync
  const {
    data: rawData,
    isLoading,
    isFetching,
  } = useGetDivisionTypesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
  });

  // Initialize Delete Mutation
  const [deleteDivision] = useDeleteDivisionMutation();

  // 🛡️ SAFE DATA NORMALIZATION
  const divisions: DivisionItem[] = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray(rawData.data)) return rawData.data;
    return [];
  }, [rawData]);

  // Client-side Search Filter
  const filteredDivisions = useMemo(() => {
    return divisions.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [divisions, searchTerm]);

  // Delete Division Handler
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const toastId = toast.loading("Deleting division...");

    try {
      await deleteDivision(id).unwrap();
      toast.success("Division deleted successfully", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete division", {
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
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/60 p-6 shadow-sm backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
                <MapPin className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                    Geographic Divisions
                  </h1>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                    {isFetching && !isLoading ? "Syncing" : "Live"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage regional divisions and destinations across tour
                  networks.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              <AddDivisionModal />
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/40 pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 p-3">
              <Globe2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Total Divisions
                </p>
                <p className="text-base font-bold text-foreground">
                  {divisions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-[11px] text-muted-foreground">
                  System Status
                </p>
                <p className="text-base font-bold text-foreground">
                  Operational
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 p-3 sm:col-span-1">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Sync Interval
                </p>
                <p className="text-base font-bold text-foreground">
                  15s Auto-fetch
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search division name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredDivisions.length}
            </span>{" "}
            of {divisions.length} divisions
          </p>
        </div>

        {/* Table Container */}
        <Card className="overflow-hidden border border-border/40 bg-card/60 shadow-xl backdrop-blur-xl">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center gap-4"
                  >
                    <div className="h-14 w-14 rounded-xl bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 rounded bg-muted"></div>
                      <div className="h-3 w-1/6 rounded bg-muted"></div>
                    </div>
                    <div className="h-8 w-16 rounded-md bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/60 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="py-4 pl-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[100px]">
                      Thumbnail
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Division Name
                    </TableHead>
                    <TableHead className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                      Slug Reference
                    </TableHead>
                    <TableHead className="pr-6 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDivisions.length > 0 ? (
                    filteredDivisions.map((item) => (
                      // 🔴 FIXED: Removed MotionTableRow, using standard TableRow
                      <TableRow
                        key={item._id}
                        className="group border-b border-border/30 transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="py-3 pl-6">
                          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50 shadow-sm">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <ImageOff className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="font-bold text-foreground">
                          {item.name}
                        </TableCell>

                        <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                          <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-[11px] text-primary">
                            /
                            {item.slug ||
                              item.name.toLowerCase().replace(/\s+/g, "-")}
                          </span>
                        </TableCell>

                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <DeleteConfirmation
                              onConfirm={() => handleDelete(item._id)}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={deletingId === item._id}
                                className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              >
                                {deletingId === item._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </DeleteConfirmation>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent border-none">
                      <TableCell colSpan={4} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-muted-foreground">
                            <MapPin className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-foreground">
                              No Divisions Found
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {searchTerm
                                ? "No divisions match your search filter."
                                : "Get started by adding a new division."}
                            </p>
                          </div>
                          {!searchTerm && (
                            <Button
                              asChild
                              className="mt-2 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                            >
                              <AddDivisionModal />
                            </Button>
                          )}
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
