/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, formatISO, differenceInDays } from "date-fns";
import { toast } from "sonner";
import {
  CalendarIcon,
  Compass,
  MapPin,
  DollarSign,
  Loader2,
  PlusCircle,
  Sparkles,
  X,
  Plus,
  Image as ImageIcon,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  PlaneTakeoff,
  Eye,
  Mountain,
  Info,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { PageWrapper } from "@/components/layout/PageWrapper";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
import {
  useAddTourMutation,
  useGetTourTypesQuery,
} from "@/redux/features/Tour/tour.api";

/* ================================================================ */
/*  VALIDATION SCHEMA                                                */
/* ================================================================ */

const addTourSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title must be under 120 characters"),

    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(5000, "Description must be under 5000 characters"),

    division: z.string().min(1, "Please select a division"),
    tourType: z.string().min(1, "Please select a tour type"),

    location: z.string().min(2, "Location is required"),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),

    /* ── PRICE: z.coerce.number handles string→number ── */
    price: z.coerce
      .number({
        error: "Price must be a valid number",
      })
      .min(1, "Price must be at least ৳1")
      .max(999999, "Price cannot exceed ৳999,999"),

    discountPrice: z.coerce
      .number({
        error: "Discount must be a valid number",
      })
      .min(0, "Discount cannot be negative")
      .optional()
      .default(0),

    maxGuest: z.coerce
      .number({
        error: "Max guests must be a number",
      })
      .min(1, "At least 1 guest required")
      .max(500, "Maximum 500 guests")
      .optional()
      .default(20),

    difficulty: z
      .enum(["Easy", "Moderate", "Hard", "Extreme"])
      .optional()
      .default("Moderate"),

    rating: z.coerce.number().min(0).max(5).optional().default(0),

    startDate: z.date({
      error: "Start date is required",
    }),

    endDate: z.date({
      error: "End date is required",
    }),

    departureTime: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  })
  .refine(
    (data) =>
      !data.discountPrice ||
      data.discountPrice === 0 ||
      data.discountPrice < data.price,
    {
      message: "Discount price must be less than regular price",
      path: ["discountPrice"],
    },
  );

type AddTourFormValues = z.infer<typeof addTourSchema>;

/* ================================================================ */
/*  STAR CURSOR + TRAIL                                              */
/* ================================================================ */

function StarCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const idRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const now = Date.now();
      if (now - lastRef.current < 45) return;
      lastRef.current = now;
      const id = idRef.current++;
      setTrail((prev) => [
        ...prev.slice(-10),
        { id, x: e.clientX, y: e.clientY },
      ]);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Star cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden xl:flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className="drop-shadow-[0_0_8px_rgba(232,130,42,0.8)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <polygon
            points="12,0 14.5,8.5 24,9.5 17,15.5 19,24 12,19.5 5,24 7,15.5 0,9.5 9.5,8.5"
            fill="rgba(232,130,42,0.9)"
          />
        </motion.svg>
        <div className="absolute w-9 h-9 rounded-full border border-[#e8822a]/25" />
      </motion.div>

      {/* Trailing dots */}
      {trail.map((pt) => (
        <motion.div
          key={pt.id}
          className="fixed top-0 left-0 pointer-events-none z-50"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.55 }}
          style={{ x: pt.x - 2, y: pt.y - 2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#e8822a]/60" />
        </motion.div>
      ))}
    </>
  );
}

/* ================================================================ */
/*  3D TILT IMAGE PREVIEW                                            */
/* ================================================================ */

function Preview3DCard({
  src,
  index,
  onRemove,
}: {
  src: string;
  index: number;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sp = { stiffness: 200, damping: 25 };
  const rx = useSpring(useTransform(my, [-150, 150], [12, -12]), sp);
  const ry = useSpring(useTransform(mx, [-150, 150], [-12, 12]), sp);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set(e.clientX - r.left - r.width / 2);
      my.set(e.clientY - r.top - r.height / 2);
    },
    [mx, my],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="relative group rounded-2xl overflow-hidden border border-[#3a3a3a] shadow-[0_12px_35px_rgba(0,0,0,0.45)] cursor-pointer"
      style={{
        perspective: 800,
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
      }}
    >
      <img
        src={src}
        alt={`Preview ${index + 1}`}
        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/85 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <X className="w-3 h-3" />
      </button>
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#e8822a]/80 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
        #{index + 1}
      </div>
    </motion.div>
  );
}

/* ================================================================ */
/*  TAG INPUT                                                        */
/* ================================================================ */

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
  variant,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (idx: number) => void;
  placeholder: string;
  variant: "green" | "red";
}) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      toast.error("Item already added");
      return;
    }
    onAdd(trimmed);
    setInput("");
  };

  const chipCls =
    variant === "green"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="h-9 flex-1 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:ring-0"
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          className="h-9 px-3 border-[#3a3a3a] text-[#e8822a] hover:bg-[#e8822a]/10 hover:border-[#e8822a]"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${chipCls}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================ */
/*  SECTION HEADER                                                   */
/* ================================================================ */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#2a2a2a]">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8822a]/10 text-[#e8822a]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-[10px] text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  MAIN: AddTour                                                    */
/* ================================================================ */

export function AddTour() {
  const { data: divisionData } = useGetDivisionTypesQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [includedTags, setIncludedTags] = useState<string[]>([]);
  const [excludedTags, setExcludedTags] = useState<string[]>([]);

  /* ── Options ── */
  const divisionOptions: { value: string; label: string }[] =
    divisionData?.data?.map((item: any) => ({
      value: item._id,
      label: item.name,
    })) ?? [];

  const tourTypeOptions: { value: string; label: string }[] = (() => {
    if (tourTypeData?.data)
      return tourTypeData.data.map((item: any) => ({
        value: item._id,
        label: item.name,
      }));
    if (Array.isArray(tourTypeData))
      return tourTypeData.map((item: any) => ({
        value: item._id,
        label: item.name,
      }));
    return [];
  })();

  /* ── Form ── */
  const form = useForm<AddTourFormValues>({
    resolver: zodResolver(addTourSchema) as Resolver<AddTourFormValues>,
    defaultValues: {
      title: "",
      description: "",
      division: "",
      tourType: "",
      location: "",
      departureLocation: "",
      arrivalLocation: "",
      price: undefined as any,
      discountPrice: 0,
      maxGuest: 20,
      difficulty: "Moderate",
      rating: 0,
      startDate: undefined,
      endDate: undefined,
      departureTime: "08:00",
    },
  });

  const [addTour, { isLoading: isSubmitting }] = useAddTourMutation();

  /* ── Watch for live preview ── */
  const watchTitle = form.watch("title");
  const watchPrice = form.watch("price");
  const watchDiscount = form.watch("discountPrice");
  const watchLocation = form.watch("location");
  const watchStart = form.watch("startDate");
  const watchEnd = form.watch("endDate");
  const watchDifficulty = form.watch("difficulty");
  const watchMaxGuest = form.watch("maxGuest");

  const tripDays =
    watchStart && watchEnd ? differenceInDays(watchEnd, watchStart) + 1 : 0;

  const effectivePrice =
    watchDiscount && watchDiscount > 0 ? watchDiscount : watchPrice || 0;

  const hasDiscount =
    watchDiscount &&
    watchDiscount > 0 &&
    watchPrice &&
    watchDiscount < watchPrice;

  /* ── Image handlers ── */
  const handleImagesChange = useCallback(
    (files: File[]) => {
      setImages(files);
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
      setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
    },
    [previewUrls],
  );

  const handleRemoveImage = useCallback(
    (idx: number) => {
      URL.revokeObjectURL(previewUrls[idx]);
      const nextFiles = images.filter((_, i) => i !== idx);
      const nextUrls = previewUrls.filter((_, i) => i !== idx);
      setImages(nextFiles);
      setPreviewUrls(nextUrls);
    },
    [images, previewUrls],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Submit ── */
  const onSubmit = async (data: AddTourFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image!");
      return;
    }

    const toastId = toast.loading("Creating tour package...");

    try {
      const payload = {
        title: data.title,
        description: data.description,
        division: data.division,
        tourType: data.tourType,
        location: data.location,
        departureLocation: data.departureLocation || data.location,
        arrivalLocation: data.arrivalLocation || data.location,

        /* ✅ Price as explicit number + alias */
        price: Number(data.price),
        costFrom: Number(data.price),
        discountPrice: Number(data.discountPrice || 0),

        maxGuest: Number(data.maxGuest || 20),
        difficulty: data.difficulty || "Moderate",
        rating: Number(data.rating || 0),
        departureTime: data.departureTime || "08:00",

        startDate: formatISO(data.startDate),
        endDate: formatISO(data.endDate),

        included: includedTags,
        excluded: excludedTags,
      };

      const formData = new FormData();
      images.forEach((img) => formData.append("files", img));
      formData.append("data", JSON.stringify(payload));

      const res = await addTour(formData).unwrap();

      if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
        toast.dismiss(toastId);
        toast.success("Tour created successfully! 🎉");
        form.reset();
        setImages([]);
        setPreviewUrls([]);
        setIncludedTags([]);
        setExcludedTags([]);
      } else {
        toast.dismiss(toastId);
        toast.error(res?.message || "Failed to create tour!");
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      console.error("Tour creation error:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to create tour!",
      );
    }
  };

  /* ── Reusable classes ── */
  const FC =
    "h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:ring-0";
  const LB = "text-[11px] font-bold uppercase tracking-wider text-gray-400";
  const ER = "text-[10px] text-red-400";

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <PageWrapper>
      <StarCursor />

      <div className="py-6 relative">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#e8822a]/[0.04] rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* ═══════════════════════════════════════════════════════ */}
          {/* FORM — 2 columns                                       */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="xl:col-span-2">
            <Card className="w-full border border-[#2a2a2a] bg-[#181818]/90 backdrop-blur-xl text-gray-200 shadow-2xl shadow-black/40 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-[#2a2a2a] pb-5 bg-gradient-to-r from-[#1a1a1a] to-[#222]">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8822a] to-[#d07323] text-white shadow-lg shadow-[#e8822a]/20"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Compass className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-lg font-black text-white tracking-tight">
                      Add New Tour Package
                    </CardTitle>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Publish a new tour offering to the travel catalog
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* ─────── 1. BASIC INFO ─────── */}
                    <SectionHeader
                      icon={Sparkles}
                      title="Basic Information"
                      subtitle="Tour identity & categorization"
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LB}>Tour Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Sundarbans Wildlife Adventure"
                              {...field}
                              className={cn(FC, "h-11")}
                            />
                          </FormControl>
                          <FormMessage className={ER} />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="division"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>Division</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className={FC}>
                                <SelectValue placeholder="Select division" />
                              </SelectTrigger>
                              <SelectContent className="border-[#3a3a3a] bg-[#222] text-xs text-gray-200">
                                {divisionOptions.map((d) => (
                                  <SelectItem
                                    key={d.value}
                                    value={d.value}
                                    className="focus:bg-[#1a1a1a] focus:text-white"
                                  >
                                    {d.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tourType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>Tour Type</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className={FC}>
                                <SelectValue placeholder="Select tour type" />
                              </SelectTrigger>
                              <SelectContent className="border-[#3a3a3a] bg-[#222] text-xs text-gray-200">
                                {tourTypeOptions.map((t) => (
                                  <SelectItem
                                    key={t.value}
                                    value={t.value}
                                    className="focus:bg-[#1a1a1a] focus:text-white"
                                  >
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ─────── 2. LOCATIONS ─────── */}
                    <SectionHeader
                      icon={MapPin}
                      title="Locations"
                      subtitle="Where the tour happens"
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LB}>Primary Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                              <Input
                                placeholder="e.g. Cox's Bazar, Bangladesh"
                                {...field}
                                className={cn(FC, "pl-9")}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className={ER} />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="departureLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>
                              Departure From
                              <span className="text-gray-600 normal-case font-normal ml-1 lowercase">
                                optional
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <PlaneTakeoff className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                                <Input
                                  placeholder="e.g. Dhaka"
                                  {...field}
                                  className={cn(FC, "pl-9")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="arrivalLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>
                              Arrival At
                              <span className="text-gray-600 normal-case font-normal ml-1 lowercase">
                                optional
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                                <Input
                                  placeholder="e.g. Cox's Bazar"
                                  {...field}
                                  className={cn(FC, "pl-9")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ─────── 3. PRICING & CAPACITY ─────── */}
                    <SectionHeader
                      icon={DollarSign}
                      title="Pricing & Capacity"
                      subtitle="Cost, discounts, and group size"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* ✅ PRICE PER PERSON — z.coerce.number */}
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>
                              Price per Person (৳) *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#e8822a]">
                                  ৳
                                </span>
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  placeholder="5500"
                                  value={
                                    field.value === undefined ||
                                    field.value === null
                                      ? ""
                                      : field.value
                                  }
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === "" ? undefined : v);
                                  }}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={cn(FC, "pl-8")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />

                      {/* DISCOUNT PRICE */}
                      <FormField
                        control={form.control}
                        name="discountPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>
                              Discount Price (৳)
                              <span className="text-gray-600 normal-case font-normal ml-1 lowercase">
                                optional
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-500">
                                  ৳
                                </span>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  placeholder="0"
                                  value={
                                    field.value === undefined ||
                                    field.value === null
                                      ? ""
                                      : field.value
                                  }
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === "" ? 0 : v);
                                  }}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={cn(FC, "pl-8")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />

                      {/* MAX GUESTS */}
                      <FormField
                        control={form.control}
                        name="maxGuest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>Max Guests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                                <Input
                                  type="number"
                                  min="1"
                                  max="500"
                                  step="1"
                                  placeholder="20"
                                  value={
                                    field.value === undefined ||
                                    field.value === null
                                      ? ""
                                      : field.value
                                  }
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === "" ? undefined : v);
                                  }}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={cn(FC, "pl-9")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Difficulty & Departure Time */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>
                              Difficulty Level
                            </FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className={FC}>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent className="border-[#3a3a3a] bg-[#222] text-xs text-gray-200">
                                <SelectItem
                                  value="Easy"
                                  className="focus:bg-[#1a1a1a] focus:text-white"
                                >
                                  🟢 Easy
                                </SelectItem>
                                <SelectItem
                                  value="Moderate"
                                  className="focus:bg-[#1a1a1a] focus:text-white"
                                >
                                  🟡 Moderate
                                </SelectItem>
                                <SelectItem
                                  value="Hard"
                                  className="focus:bg-[#1a1a1a] focus:text-white"
                                >
                                  🟠 Hard
                                </SelectItem>
                                <SelectItem
                                  value="Extreme"
                                  className="focus:bg-[#1a1a1a] focus:text-white"
                                >
                                  🔴 Extreme
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departureTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LB}>Departure Time</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                                <Input
                                  type="time"
                                  {...field}
                                  className={cn(FC, "pl-9")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ─────── 4. SCHEDULE ─────── */}
                    <SectionHeader
                      icon={CalendarIcon}
                      title="Schedule"
                      subtitle="Tour start & end dates"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className={cn(LB, "mb-1")}>
                              Start Date
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  className={cn(
                                    "h-10 w-full justify-between border-[#3a3a3a] bg-[#1a1a1a] px-3 text-left text-xs font-normal text-white hover:bg-[#222]",
                                    !field.value && "text-gray-500",
                                  )}
                                >
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick start date"}
                                  <CalendarIcon className="h-4 w-4 text-[#e8822a]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto border-[#3a3a3a] bg-[#222] p-0 text-white"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date <
                                    new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                  className="bg-[#222] text-white"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className={cn(LB, "mb-1")}>
                              End Date
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  className={cn(
                                    "h-10 w-full justify-between border-[#3a3a3a] bg-[#1a1a1a] px-3 text-left text-xs font-normal text-white hover:bg-[#222]",
                                    !field.value && "text-gray-500",
                                  )}
                                >
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick end date"}
                                  <CalendarIcon className="h-4 w-4 text-[#e8822a]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto border-[#3a3a3a] bg-[#222] p-0 text-white"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    const sd = form.getValues("startDate");
                                    const today = new Date(
                                      new Date().setHours(0, 0, 0, 0),
                                    );
                                    return sd
                                      ? date < new Date(sd)
                                      : date < today;
                                  }}
                                  initialFocus
                                  className="bg-[#222] text-white"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className={ER} />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Trip duration badge */}
                    {tripDays > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {tripDays} day{tripDays !== 1 ? "s" : ""} &middot;{" "}
                        {tripDays - 1 > 0
                          ? `${tripDays - 1} night${tripDays - 1 !== 1 ? "s" : ""}`
                          : "Day trip"}
                      </motion.div>
                    )}

                    {/* ─────── 5. DESCRIPTION ─────── */}
                    <SectionHeader
                      icon={Info}
                      title="Description & Details"
                      subtitle="Itinerary, inclusions, exclusions"
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LB}>
                            Tour Overview & Itinerary
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={5}
                              className="w-full rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:outline-none focus:ring-0 resize-none"
                              placeholder="Day 1: Arrival & check-in...&#10;Day 2: Sightseeing & activities...&#10;Day 3: Departure..."
                            />
                          </FormControl>
                          <p className="text-[10px] text-gray-600 text-right">
                            {field.value?.length || 0}/5000
                          </p>
                          <FormMessage className={ER} />
                        </FormItem>
                      )}
                    />

                    {/* Included / Excluded tag inputs */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label
                          className={cn(
                            LB,
                            "mb-2 block flex items-center gap-1.5",
                          )}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Included Items
                        </label>
                        <TagInput
                          tags={includedTags}
                          onAdd={(t) => setIncludedTags((p) => [...p, t])}
                          onRemove={(i) =>
                            setIncludedTags((p) =>
                              p.filter((_, idx) => idx !== i),
                            )
                          }
                          placeholder="e.g. Hotel, Meals"
                          variant="green"
                        />
                      </div>
                      <div>
                        <label
                          className={cn(
                            LB,
                            "mb-2 block flex items-center gap-1.5",
                          )}
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          Excluded Items
                        </label>
                        <TagInput
                          tags={excludedTags}
                          onAdd={(t) => setExcludedTags((p) => [...p, t])}
                          onRemove={(i) =>
                            setExcludedTags((p) =>
                              p.filter((_, idx) => idx !== i),
                            )
                          }
                          placeholder="e.g. Airfare, Visa"
                          variant="red"
                        />
                      </div>
                    </div>

                    {/* ─────── 6. GALLERY ─────── */}
                    <SectionHeader
                      icon={ImageIcon}
                      title="Gallery Images"
                      subtitle="At least 1 image required"
                    />

                    <div className="rounded-2xl border border-[#3a3a3a] bg-[#1a1a1a] p-5">
                      <MultipleImageUploader onChange={handleImagesChange} />

                      {previewUrls.length > 0 && (
                        <div className="mt-5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-3">
                            3D Preview ({previewUrls.length} image
                            {previewUrls.length !== 1 ? "s" : ""})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            <AnimatePresence>
                              {previewUrls.map((url, idx) => (
                                <Preview3DCard
                                  key={url}
                                  src={url}
                                  index={idx}
                                  onRemove={() => handleRemoveImage(idx)}
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ─────── SUBMIT ─────── */}
                    <div className="pt-4">
                      <motion.div
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#e8822a] to-[#d07323] text-sm font-bold text-white shadow-xl shadow-[#e8822a]/20 hover:shadow-[#e8822a]/40 disabled:opacity-50 transition-shadow"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              Publishing Tour...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <PlusCircle className="h-4 w-4" />
                              Create Tour Package
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* LIVE 3D PREVIEW SIDEBAR — 1 column                     */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-5">
              {/* ── Preview Card ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-[#2a2a2a] bg-[#181818]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
              >
                <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#e8822a]" />
                    Live Preview
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Updates as you type
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Preview image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
                    {previewUrls[0] ? (
                      <motion.img
                        key={previewUrls[0]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        src={previewUrls[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-500 text-white text-[10px] font-black shadow-lg">
                        {Math.round(
                          ((watchPrice - watchDiscount) / watchPrice) * 100,
                        )}
                        % OFF
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight min-h-[2.5rem]">
                    {watchTitle || "Tour Title Preview"}
                  </h4>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-[#e8822a] shrink-0" />
                    <span className="truncate">
                      {watchLocation || "Location preview"}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {watchDifficulty && (
                      <span className="px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-400 text-[10px] font-semibold border border-violet-500/25">
                        {watchDifficulty}
                      </span>
                    )}
                    {tripDays > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 text-[10px] font-semibold border border-sky-500/25">
                        {tripDays}D / {Math.max(0, tripDays - 1)}N
                      </span>
                    )}
                    {watchMaxGuest && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold border border-emerald-500/25">
                        Max {watchMaxGuest}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pt-3 border-t border-[#2a2a2a]">
                    <div className="flex items-end justify-between">
                      <div>
                        {hasDiscount && (
                          <span className="text-xs text-gray-500 line-through block">
                            ৳{Number(watchPrice).toLocaleString()}
                          </span>
                        )}
                        <span className="text-2xl font-black text-[#e8822a]">
                          ৳{Number(effectivePrice || 0).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        per person
                      </span>
                    </div>
                  </div>

                  {/* Included preview */}
                  {includedTags.length > 0 && (
                    <div className="pt-3 border-t border-[#2a2a2a]">
                      <p className="text-[10px] text-emerald-400 font-semibold mb-1.5 uppercase tracking-wider">
                        ✓ Included
                      </p>
                      <div className="space-y-0.5">
                        {includedTags.slice(0, 5).map((tag, i) => (
                          <p
                            key={i}
                            className="text-[11px] text-gray-400 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500/40 shrink-0" />
                            {tag}
                          </p>
                        ))}
                        {includedTags.length > 5 && (
                          <p className="text-[10px] text-gray-500 ml-4">
                            +{includedTags.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Excluded preview */}
                  {excludedTags.length > 0 && (
                    <div className="pt-3 border-t border-[#2a2a2a]">
                      <p className="text-[10px] text-red-400 font-semibold mb-1.5 uppercase tracking-wider">
                        ✗ Excluded
                      </p>
                      <div className="space-y-0.5">
                        {excludedTags.slice(0, 3).map((tag, i) => (
                          <p
                            key={i}
                            className="text-[11px] text-gray-400 flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3 text-red-500/40 shrink-0" />
                            {tag}
                          </p>
                        ))}
                        {excludedTags.length > 3 && (
                          <p className="text-[10px] text-gray-500 ml-4">
                            +{excludedTags.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ── Pro Tips ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-[#2a2a2a] bg-[#181818]/90 backdrop-blur-xl p-5 shadow-xl"
              >
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e8822a]" />
                  Pro Tips
                </h4>
                <ul className="space-y-2.5 text-[11px] text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#e8822a] mt-0.5 shrink-0">→</span>
                    Upload high-res images (1200×800 min)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e8822a] mt-0.5 shrink-0">→</span>
                    Set a discount price to boost bookings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e8822a] mt-0.5 shrink-0">→</span>
                    List inclusions clearly — travelers love transparency
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e8822a] mt-0.5 shrink-0">→</span>
                    Keep description under 500 words for readability
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e8822a] mt-0.5 shrink-0">→</span>
                    Price must be a whole number greater than zero
                  </li>
                </ul>
              </motion.div>

              {/* ── Field Summary ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl border border-[#2a2a2a] bg-[#181818]/90 backdrop-blur-xl p-5 shadow-xl"
              >
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-[#e8822a]" />
                  Field Summary
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Price
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      ৳{Number(watchPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Discount
                    </p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      ৳{Number(watchDiscount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Duration
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {tripDays > 0 ? `${tripDays}D` : "—"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Images
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {images.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { format, formatISO } from "date-fns";
// import { toast } from "sonner";
// import { motion, useMotionValue, useTransform } from "framer-motion";
// import {
//   CalendarIcon,
//   Compass,
//   MapPin,
//   Tag,
//   Loader2,
//   PlusCircle,
//   Sparkles,
//   Users,
//   Clock,
//   ShieldCheck,
//   CheckCircle2,
//   Image as ImageIcon,
//   Banknote,
//   Info,
// } from "lucide-react";

// import { PageWrapper } from "@/components/layout/PageWrapper";
// import MultipleImageUploader from "@/components/MultipleImageUploader";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
// import {
//   useAddTourMutation,
//   useGetTourTypesQuery,
// } from "@/redux/features/Tour/tour.api";

// // --- ENHANCED FORM VALIDATION SCHEMA ---
// const addTourSchema = z.object({
//   title: z.string().min(3, "Tour title must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   division: z.string().min(1, "Please select a division"),
//   tourType: z.string().min(1, "Please select a tour type"),
//   location: z.string().min(2, "Location is required"),
//   // FIXED: Explicit coerce for numeric conversion & validation
//   price: z.coerce
//     .number({ invalid_type_error: "Price must be a valid number" })
//     .positive("Price must be greater than 0"),
//   maxCapacity: z.coerce
//     .number()
//     .min(1, "Capacity must be at least 1 person")
//     .optional(),
//   durationDays: z.coerce
//     .number()
//     .min(1, "Duration must be at least 1 day")
//     .optional(),
//   startDate: z.date({ required_error: "Start date is required" }),
//   endDate: z.date({ required_error: "End date is required" }),
// });

// type AddTourFormValues = z.infer<typeof addTourSchema>;

// const AMENITY_OPTIONS = [
//   "Hotel Stay",
//   "Tour Guide",
//   "Meals Included",
//   "AC Transport",
//   "Photography",
//   "First Aid Kit",
// ];

// export function AddTour() {
//   const { data: divisionData } = useGetDivisionTypesQuery(undefined);
//   const { data: tourTypeData } = useGetTourTypesQuery(undefined);

//   const [images, setImages] = useState<File[]>([]);
//   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

//   // Custom Cursor Interaction Coordinates
//   const cursorX = useMotionValue(-100);
//   const cursorY = useMotionValue(-100);
//   const [isHovered, setIsHovered] = useState(false);

//   // 3D Perspective Tilt Coordinates
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
//   const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       cursorX.set(e.clientX);
//       cursorY.set(e.clientY);
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [cursorX, cursorY]);

//   const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     mouseX.set(e.clientX - (rect.left + rect.width / 2));
//     mouseY.set(e.clientY - (rect.top + rect.height / 2));
//   };

//   // Safe extractors for options dropdowns
//   const divisionOptions =
//     divisionData?.data?.map((item: { _id: string; name: string }) => ({
//       value: item._id,
//       label: item.name,
//     })) || [];

//   const tourTypeOptions =
//     tourTypeData?.data?.map((item: { _id: string; name: string }) => ({
//       value: item._id,
//       label: item.name,
//     })) ||
//     (Array.isArray(tourTypeData)
//       ? tourTypeData.map((item: any) => ({
//           value: item._id,
//           label: item.name,
//         }))
//       : []);

//   const form = useForm<AddTourFormValues>({
//     resolver: zodResolver(addTourSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       division: "",
//       tourType: "",
//       location: "",
//       price: undefined,
//       maxCapacity: 10,
//       durationDays: 3,
//       startDate: undefined,
//       endDate: undefined,
//     },
//   });

//   const watchValues = form.watch();

//   const [addTour, { isLoading: isSubmitting }] = useAddTourMutation();

//   const toggleAmenity = (amenity: string) => {
//     if (selectedAmenities.includes(amenity)) {
//       setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
//     } else {
//       setSelectedAmenities([...selectedAmenities, amenity]);
//     }
//   };

//   const onSubmit = async (data: AddTourFormValues) => {
//     if (images.length === 0) {
//       toast.error("Please upload at least one image for the tour!");
//       return;
//     }

//     const toastId = toast.loading("Publishing tour package to catalog...");

//     try {
//       // Structure complete tour data payload
//       const tourPayload = {
//         title: data.title,
//         description: data.description,
//         division: data.division,
//         tourType: data.tourType,
//         location: data.location,
//         price: Number(data.price), // Ensured numeric format
//         maxCapacity: data.maxCapacity ? Number(data.maxCapacity) : undefined,
//         durationDays: data.durationDays ? Number(data.durationDays) : undefined,
//         amenities: selectedAmenities,
//         startDate: formatISO(data.startDate),
//         endDate: formatISO(data.endDate),
//       };

//       const formData = new FormData();
//       images.forEach((image) => formData.append("files", image));
//       formData.append("data", JSON.stringify(tourPayload));

//       const res = await addTour(formData).unwrap();

//       if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
//         toast.dismiss(toastId);
//         toast.success("Tour package created successfully!");

//         // Reset state
//         form.reset();
//         setImages([]);
//         setSelectedAmenities([]);
//       } else {
//         toast.dismiss(toastId);
//         toast.error(res?.message || "Failed to create tour package!");
//       }
//     } catch (err: any) {
//       toast.dismiss(toastId);
//       console.error("Failed to create tour:", err);
//       toast.error(
//         err?.data?.message || err?.message || "Failed to create tour package!",
//       );
//     }
//   };

//   return (
//     <PageWrapper>
//       <div
//         onMouseMove={handleContainerMouseMove}
//         className="relative min-h-screen py-10 px-2 sm:px-4 text-slate-100 overflow-hidden"
//         style={{ perspective: 1200 }}
//       >
//         {/* --- CUSTOM INTERACTIVE CURSOR RING --- */}
//         <motion.div
//           className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-emerald-400 pointer-events-none z-50 mix-blend-difference hidden lg:block"
//           style={{
//             x: cursorX,
//             y: cursorY,
//             translateX: "-50%",
//             translateY: "-50%",
//           }}
//           animate={{
//             scale: isHovered ? 2.2 : 1,
//             backgroundColor: isHovered
//               ? "rgba(52, 211, 153, 0.25)"
//               : "transparent",
//           }}
//           transition={{ type: "spring", stiffness: 350, damping: 25 }}
//         />

//         {/* --- BACKGROUND GLOW & RETRO GRID --- */}
//         <div className="absolute inset-0 pointer-events-none z-0">
//           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
//           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
//           <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px]" />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto">
//           {/* Header Banner */}
//           <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
//             <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
//               <Sparkles className="w-3.5 h-3.5" /> Ultra-Modern Admin Studio
//             </div>
//             <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
//               Create Travel Experience
//             </h1>
//             <p className="text-xs sm:text-sm text-slate-400">
//               Configure parameters, pricing models, and publish 3D virtual tour
//               packages instantly.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//             {/* LEFT COLUMN: MAIN FORM (8 COLS) */}
//             <motion.div
//               style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
//               className="lg:col-span-7 xl:col-span-8"
//             >
//               <Card className="border border-slate-800 bg-slate-900/90 backdrop-blur-2xl text-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden">
//                 <CardHeader className="border-b border-slate-800/80 pb-5 bg-slate-950/40">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
//                       <Compass className="h-6 w-6" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-lg font-bold text-white tracking-tight">
//                         Package Specifications
//                       </CardTitle>
//                       <CardDescription className="text-xs text-slate-400">
//                         Fill in all required fields to populate the catalog
//                       </CardDescription>
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-6 space-y-6">
//                   <Form {...form}>
//                     <form
//                       onSubmit={form.handleSubmit(onSubmit)}
//                       className="space-y-6"
//                     >
//                       {/* Tour Title */}
//                       <FormField
//                         control={form.control}
//                         name="title"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                               Tour Title
//                             </FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="e.g. Sajek Valley Cloud Adventure & Camping"
//                                 {...field}
//                                 onMouseEnter={() => setIsHovered(true)}
//                                 onMouseLeave={() => setIsHovered(false)}
//                                 className="h-11 border-slate-800 bg-slate-950/70 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl"
//                               />
//                             </FormControl>
//                             <FormMessage className="text-[11px] text-rose-400" />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Division & Tour Type */}
//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="division"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Division
//                               </FormLabel>
//                               <Select
//                                 onValueChange={field.onChange}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   onMouseEnter={() => setIsHovered(true)}
//                                   onMouseLeave={() => setIsHovered(false)}
//                                   className="h-11 border-slate-800 bg-slate-950/70 text-xs text-white focus:border-emerald-500 rounded-xl"
//                                 >
//                                   <SelectValue placeholder="Select division" />
//                                 </SelectTrigger>
//                                 <SelectContent className="border-slate-800 bg-slate-900 text-xs text-slate-200">
//                                   {divisionOptions.map((item: any) => (
//                                     <SelectItem
//                                       key={item.value}
//                                       value={item.value}
//                                       className="focus:bg-slate-800 focus:text-white"
//                                     >
//                                       {item.label}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name="tourType"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Tour Category / Type
//                               </FormLabel>
//                               <Select
//                                 onValueChange={field.onChange}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   onMouseEnter={() => setIsHovered(true)}
//                                   onMouseLeave={() => setIsHovered(false)}
//                                   className="h-11 border-slate-800 bg-slate-950/70 text-xs text-white focus:border-emerald-500 rounded-xl"
//                                 >
//                                   <SelectValue placeholder="Select tour type" />
//                                 </SelectTrigger>
//                                 <SelectContent className="border-slate-800 bg-slate-900 text-xs text-slate-200">
//                                   {tourTypeOptions.map((item: any) => (
//                                     <SelectItem
//                                       key={item.value}
//                                       value={item.value}
//                                       className="focus:bg-slate-800 focus:text-white"
//                                     >
//                                       {item.label}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       {/* Location & FIXED PRICE FIELD */}
//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="location"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Destination / Spot
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="relative">
//                                   <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                                   <Input
//                                     placeholder="e.g. Rangamati, Bangladesh"
//                                     {...field}
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                     className="h-11 border-slate-800 bg-slate-950/70 pl-9 text-xs text-white placeholder-slate-500 focus:border-emerald-500 rounded-xl"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />

//                         {/* PRICE FIELD FIXED */}
//                         <FormField
//                           control={form.control}
//                           name="price"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Price per Person (BDT ৳)
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="relative">
//                                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
//                                     ৳
//                                   </span>
//                                   <Input
//                                     type="number"
//                                     placeholder="5500"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) =>
//                                       field.onChange(
//                                         e.target.valueAsNumber || "",
//                                       )
//                                     }
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                     className="h-11 border-slate-800 bg-slate-950/70 pl-8 text-xs font-semibold text-emerald-300 placeholder-slate-500 focus:border-emerald-500 rounded-xl"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       {/* Extended Info: Capacity & Duration */}
//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="maxCapacity"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Max Capacity (People)
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="relative">
//                                   <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                                   <Input
//                                     type="number"
//                                     placeholder="15"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) =>
//                                       field.onChange(
//                                         e.target.valueAsNumber || "",
//                                       )
//                                     }
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                     className="h-11 border-slate-800 bg-slate-950/70 pl-9 text-xs text-white placeholder-slate-500 focus:border-emerald-500 rounded-xl"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name="durationDays"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Duration (Days)
//                               </FormLabel>
//                               <FormControl>
//                                 <div className="relative">
//                                   <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                                   <Input
//                                     type="number"
//                                     placeholder="3"
//                                     {...field}
//                                     value={field.value ?? ""}
//                                     onChange={(e) =>
//                                       field.onChange(
//                                         e.target.valueAsNumber || "",
//                                       )
//                                     }
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                     className="h-11 border-slate-800 bg-slate-950/70 pl-9 text-xs text-white placeholder-slate-500 focus:border-emerald-500 rounded-xl"
//                                   />
//                                 </div>
//                               </FormControl>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       {/* Start Date & End Date */}
//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="startDate"
//                           render={({ field }) => (
//                             <FormItem className="flex flex-col">
//                               <FormLabel className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 Start Date
//                               </FormLabel>
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                     className={cn(
//                                       "h-11 w-full justify-between border-slate-800 bg-slate-950/70 px-3 text-left text-xs font-normal text-white hover:bg-slate-800 rounded-xl",
//                                       !field.value && "text-slate-500",
//                                     )}
//                                   >
//                                     {field.value
//                                       ? format(field.value, "PPP")
//                                       : "Pick start date"}
//                                     <CalendarIcon className="h-4 w-4 text-emerald-400" />
//                                   </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent
//                                   className="w-auto border-slate-800 bg-slate-900 p-0 text-white"
//                                   align="start"
//                                 >
//                                   <Calendar
//                                     mode="single"
//                                     selected={field.value}
//                                     onSelect={field.onChange}
//                                     disabled={(date) =>
//                                       date <
//                                       new Date(new Date().setHours(0, 0, 0, 0))
//                                     }
//                                     initialFocus
//                                     className="bg-slate-900 text-white"
//                                   />
//                                 </PopoverContent>
//                               </Popover>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={form.control}
//                           name="endDate"
//                           render={({ field }) => (
//                             <FormItem className="flex flex-col">
//                               <FormLabel className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">
//                                 End Date
//                               </FormLabel>
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                     className={cn(
//                                       "h-11 w-full justify-between border-slate-800 bg-slate-950/70 px-3 text-left text-xs font-normal text-white hover:bg-slate-800 rounded-xl",
//                                       !field.value && "text-slate-500",
//                                     )}
//                                   >
//                                     {field.value
//                                       ? format(field.value, "PPP")
//                                       : "Pick end date"}
//                                     <CalendarIcon className="h-4 w-4 text-emerald-400" />
//                                   </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent
//                                   className="w-auto border-slate-800 bg-slate-900 p-0 text-white"
//                                   align="start"
//                                 >
//                                   <Calendar
//                                     mode="single"
//                                     selected={field.value}
//                                     onSelect={field.onChange}
//                                     disabled={(date) => {
//                                       const startDate =
//                                         form.getValues("startDate");
//                                       const today = new Date(
//                                         new Date().setHours(0, 0, 0, 0),
//                                       );
//                                       return !startDate
//                                         ? date < today
//                                         : date < new Date(startDate) ||
//                                             date < today;
//                                     }}
//                                     initialFocus
//                                     className="bg-slate-900 text-white"
//                                   />
//                                 </PopoverContent>
//                               </Popover>
//                               <FormMessage className="text-[11px] text-rose-400" />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       {/* Dynamic Amenities Multi-Select */}
//                       <div className="space-y-2">
//                         <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                           Included Tour Amenities
//                         </FormLabel>
//                         <div className="flex flex-wrap gap-2">
//                           {AMENITY_OPTIONS.map((amenity) => {
//                             const isSelected =
//                               selectedAmenities.includes(amenity);
//                             return (
//                               <button
//                                 type="button"
//                                 key={amenity}
//                                 onClick={() => toggleAmenity(amenity)}
//                                 onMouseEnter={() => setIsHovered(true)}
//                                 onMouseLeave={() => setIsHovered(false)}
//                                 className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
//                                   isSelected
//                                     ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
//                                     : "bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white"
//                                 }`}
//                               >
//                                 {isSelected && (
//                                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
//                                 )}
//                                 {amenity}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>

//                       {/* Description */}
//                       <FormField
//                         control={form.control}
//                         name="description"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                               Tour Overview & Detailed Itinerary
//                             </FormLabel>
//                             <FormControl>
//                               <textarea
//                                 {...field}
//                                 rows={4}
//                                 onMouseEnter={() => setIsHovered(true)}
//                                 onMouseLeave={() => setIsHovered(false)}
//                                 className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
//                                 placeholder="Provide detailed day-by-day itinerary, inclusions, safety guidelines..."
//                               />
//                             </FormControl>
//                             <FormMessage className="text-[11px] text-rose-400" />
//                           </FormItem>
//                         )}
//                       />

//                       {/* Multiple Image Uploader */}
//                       <div
//                         onMouseEnter={() => setIsHovered(true)}
//                         onMouseLeave={() => setIsHovered(false)}
//                         className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-2"
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
//                             <ImageIcon className="w-4 h-4 text-emerald-400" />{" "}
//                             Tour Media Gallery
//                           </span>
//                           <span className="text-[10px] text-slate-500">
//                             At least 1 image required
//                           </span>
//                         </div>
//                         <MultipleImageUploader onChange={setImages} />
//                       </div>

//                       {/* Submit Button */}
//                       <Button
//                         type="submit"
//                         disabled={isSubmitting}
//                         onMouseEnter={() => setIsHovered(true)}
//                         onMouseLeave={() => setIsHovered(false)}
//                         className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
//                       >
//                         {isSubmitting ? (
//                           <span className="flex items-center justify-center gap-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             Processing Tour Metadata...
//                           </span>
//                         ) : (
//                           <span className="flex items-center justify-center gap-2">
//                             <PlusCircle className="h-4 w-4" />
//                             Publish Tour Package
//                           </span>
//                         )}
//                       </Button>
//                     </form>
//                   </Form>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* RIGHT COLUMN: REAL-TIME 3D LIVE CARD PREVIEW (4 COLS) */}
//             <div className="lg:col-span-5 xl:col-span-4 sticky top-10 space-y-6">
//               <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
//                 <Sparkles className="w-4 h-4 text-emerald-400" /> Live 3D
//                 Preview Card
//               </div>

//               <motion.div
//                 whileHover={{ scale: 1.02, rotateY: -5 }}
//                 className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
//                 style={{ transformStyle: "preserve-3d" }}
//               >
//                 {/* Image Placeholder or Preview */}
//                 <div className="relative h-52 bg-slate-950 overflow-hidden flex items-center justify-center">
//                   {images.length > 0 ? (
//                     <img
//                       src={URL.createObjectURL(images[0])}
//                       alt="Tour preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="text-center p-4 space-y-2">
//                       <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
//                       <p className="text-[11px] text-slate-500">
//                         Upload an image to render preview
//                       </p>
//                     </div>
//                   )}
//                   <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
//                     Live Draft
//                   </div>
//                 </div>

//                 {/* Live Data Display */}
//                 <div className="p-5 space-y-4">
//                   <div>
//                     <h3 className="text-base font-bold text-white line-clamp-1">
//                       {watchValues.title || "Tour Title Preview"}
//                     </h3>
//                     <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
//                       <MapPin className="w-3.5 h-3.5 text-emerald-400" />
//                       {watchValues.location || "Location Spot"}
//                     </p>
//                   </div>

//                   {/* Price Badge */}
//                   <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
//                     <span className="text-xs text-slate-400">
//                       Calculated Price:
//                     </span>
//                     <span className="text-lg font-black text-emerald-400">
//                       ৳{" "}
//                       {watchValues.price
//                         ? Number(watchValues.price).toLocaleString()
//                         : "0"}
//                       <span className="text-[10px] text-slate-500 font-normal">
//                         {" "}
//                         / person
//                       </span>
//                     </span>
//                   </div>

//                   {/* Meta Pills */}
//                   <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
//                     <div className="p-2 rounded-xl bg-slate-800/50 flex items-center gap-1.5">
//                       <Users className="w-3.5 h-3.5 text-emerald-400" />
//                       <span>{watchValues.maxCapacity || 0} Capacity</span>
//                     </div>
//                     <div className="p-2 rounded-xl bg-slate-800/50 flex items-center gap-1.5">
//                       <Clock className="w-3.5 h-3.5 text-emerald-400" />
//                       <span>{watchValues.durationDays || 0} Days</span>
//                     </div>
//                   </div>

//                   {/* Selected Amenities List */}
//                   {selectedAmenities.length > 0 && (
//                     <div className="pt-2 border-t border-slate-800">
//                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
//                         Amenities Included
//                       </p>
//                       <div className="flex flex-wrap gap-1">
//                         {selectedAmenities.map((a) => (
//                           <span
//                             key={a}
//                             className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20"
//                           >
//                             {a}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { format, formatISO } from "date-fns";
// import { toast } from "sonner";
// import {
//   CalendarIcon,
//   Compass,
//   MapPin,
//   Tag,
//   DollarSign,
//   Calendar as CalendarIconLucide,
//   FileText,
//   Loader2,
//   PlusCircle,
//   Sparkles,
// } from "lucide-react";

// import { PageWrapper } from "@/components/layout/PageWrapper";
// import MultipleImageUploader from "@/components/MultipleImageUploader";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { useGetDivisionTypesQuery } from "@/redux/features/division/division.api";
// import {
//   useAddTourMutation,
//   useGetTourTypesQuery,
// } from "@/redux/features/Tour/tour.api";

// // --- FORM VALIDATION SCHEMA ---
// const addTourSchema = z.object({
//   title: z.string().min(3, "Tour title must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   division: z.string().min(1, "Please select a division"),
//   tourType: z.string().min(1, "Please select a tour type"),
//   location: z.string().min(2, "Location is required"),
//   price: z
//     .string()
//     .min(1, "Price is required")
//     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
//       message: "Price must be a valid positive number",
//     }),
//   startDate: z.date(),
//   endDate: z.date(),
// });

// type AddTourFormValues = z.infer<typeof addTourSchema>;

// export function AddTour() {
//   const { data: divisionData } = useGetDivisionTypesQuery(undefined);
//   const { data: tourTypeData } = useGetTourTypesQuery(undefined);
//   const [images, setImages] = useState<File[]>([]);

//   // Safe extractors for options dropdowns
//   const divisionOptions =
//     divisionData?.data?.map((item: { _id: string; name: string }) => ({
//       value: item._id,
//       label: item.name,
//     })) || [];

//   const tourTypeOptions =
//     tourTypeData?.data?.map((item: { _id: string; name: string }) => ({
//       value: item._id,
//       label: item.name,
//     })) ||
//     (Array.isArray(tourTypeData)
//       ? tourTypeData.map((item: any) => ({
//           value: item._id,
//           label: item.name,
//         }))
//       : []);

//   const form = useForm<AddTourFormValues>({
//     resolver: zodResolver(addTourSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       division: "",
//       tourType: "",
//       location: "",
//       price: "",
//       startDate: undefined,
//       endDate: undefined,
//     },
//   });

//   const [addTour, { isLoading: isSubmitting }] = useAddTourMutation();

//   const onSubmit = async (data: AddTourFormValues) => {
//     if (images.length === 0) {
//       toast.error("Please upload at least one image for the tour!");
//       return;
//     }

//     const toastId = toast.loading("Creating tour package...");

//     try {
//       // Structure tour data payload
//       const tourPayload = {
//         title: data.title,
//         description: data.description,
//         division: data.division,
//         tourType: data.tourType,
//         location: data.location,
//         price: Number(data.price),
//         startDate: formatISO(data.startDate),
//         endDate: formatISO(data.endDate),
//       };

//       // Append files and JSON payload to Multipart FormData
//       const formData = new FormData();
//       images.forEach((image) => formData.append("files", image));
//       formData.append("data", JSON.stringify(tourPayload));

//       const res = await addTour(formData).unwrap();

//       if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
//         toast.dismiss(toastId);
//         toast.success("Tour created successfully!");

//         // Reset form state
//         form.reset();
//         setImages([]);
//       } else {
//         toast.dismiss(toastId);
//         toast.error(res?.message || "Failed to create tour package!");
//       }
//     } catch (err: any) {
//       toast.dismiss(toastId);
//       console.error("Failed to create tour:", err);
//       toast.error(
//         err?.data?.message || err?.message || "Failed to create tour!",
//       );
//     }
//   };

//   return (
//     <PageWrapper>
//       <div className="py-6">
//         <Card className="mx-auto w-full max-w-3xl border border-[#2a2a2a] bg-[#222222] text-gray-200 shadow-2xl">
//           <CardHeader className="border-b border-[#2a2a2a] pb-5">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8822a]/10 text-[#e8822a]">
//                 <Compass className="h-5 w-5" />
//               </div>
//               <div>
//                 <CardTitle className="text-lg font-bold text-white tracking-tight">
//                   Add New Tour Package
//                 </CardTitle>
//                 <CardDescription className="text-xs text-gray-400">
//                   Publish a new tour offering to the travel catalog
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent className="pt-6">
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-5"
//               >
//                 {/* Tour Title */}
//                 <FormField
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                         Tour Title
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="e.g. Sundarbans Wildlife & Forest Adventure"
//                           {...field}
//                           className="h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:ring-0"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[11px] text-red-400" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Division & Tour Type */}
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <FormField
//                     control={form.control}
//                     name="division"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                           Division
//                         </FormLabel>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white focus:border-[#e8822a]">
//                             <SelectValue placeholder="Select division" />
//                           </SelectTrigger>
//                           <SelectContent className="border-[#3a3a3a] bg-[#222222] text-xs text-gray-200">
//                             {divisionOptions.map((item: any) => (
//                               <SelectItem
//                                 key={item.value}
//                                 value={item.value}
//                                 className="focus:bg-[#1a1a1a] focus:text-white"
//                               >
//                                 {item.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage className="text-[11px] text-red-400" />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="tourType"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                           Tour Type
//                         </FormLabel>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="h-10 border-[#3a3a3a] bg-[#1a1a1a] text-xs text-white focus:border-[#e8822a]">
//                             <SelectValue placeholder="Select tour type" />
//                           </SelectTrigger>
//                           <SelectContent className="border-[#3a3a3a] bg-[#222222] text-xs text-gray-200">
//                             // eslint-disable-next-line
//                             @typescript-eslint/no-explicit-any
//                             {tourTypeOptions.map((item: any) => (
//                               <SelectItem
//                                 key={item.value}
//                                 value={item.value}
//                                 className="focus:bg-[#1a1a1a] focus:text-white"
//                               >
//                                 {item.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage className="text-[11px] text-red-400" />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Location & Price */}
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <FormField
//                     control={form.control}
//                     name="location"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                           Location / Spot
//                         </FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
//                             <Input
//                               placeholder="e.g. Cox's Bazar, Bangladesh"
//                               {...field}
//                               className="h-10 border-[#3a3a3a] bg-[#1a1a1a] pl-9 text-xs text-white placeholder-gray-500 focus:border-[#e8822a]"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage className="text-[11px] text-red-400" />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="price"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                           Price per Person (BDT ৳)
//                         </FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
//                               ৳
//                             </span>
//                             <Input
//                               type="number"
//                               placeholder="5500"
//                               {...field}
//                               className="h-10 border-[#3a3a3a] bg-[#1a1a1a] pl-8 text-xs text-white placeholder-gray-500 focus:border-[#e8822a]"
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage className="text-[11px] text-red-400" />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Start Date & End Date */}
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <FormField
//                     control={form.control}
//                     name="startDate"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-300">
//                           Start Date
//                         </FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className={cn(
//                                 "h-10 w-full justify-between border-[#3a3a3a] bg-[#1a1a1a] px-3 text-left text-xs font-normal text-white hover:bg-[#222222]",
//                                 !field.value && "text-gray-500",
//                               )}
//                             >
//                               {field.value
//                                 ? format(field.value, "PPP")
//                                 : "Pick start date"}
//                               <CalendarIcon className="h-4 w-4 text-[#e8822a]" />
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent
//                             className="w-auto border-[#3a3a3a] bg-[#222222] p-0 text-white"
//                             align="start"
//                           >
//                             <Calendar
//                               mode="single"
//                               selected={field.value}
//                               onSelect={field.onChange}
//                               disabled={(date) =>
//                                 date < new Date(new Date().setHours(0, 0, 0, 0))
//                               }
//                               initialFocus
//                               className="bg-[#222222] text-white"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                         <FormMessage className="text-[11px] text-red-400" />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="endDate"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-300">
//                           End Date
//                         </FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className={cn(
//                                 "h-10 w-full justify-between border-[#3a3a3a] bg-[#1a1a1a] px-3 text-left text-xs font-normal text-white hover:bg-[#222222]",
//                                 !field.value && "text-gray-500",
//                               )}
//                             >
//                               {field.value
//                                 ? format(field.value, "PPP")
//                                 : "Pick end date"}
//                               <CalendarIcon className="h-4 w-4 text-[#e8822a]" />
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent
//                             className="w-auto border-[#3a3a3a] bg-[#222222] p-0 text-white"
//                             align="start"
//                           >
//                             <Calendar
//                               mode="single"
//                               selected={field.value}
//                               onSelect={field.onChange}
//                               disabled={(date) => {
//                                 const startDate = form.getValues("startDate");
//                                 const today = new Date(
//                                   new Date().setHours(0, 0, 0, 0),
//                                 );
//                                 return !startDate
//                                   ? date < today
//                                   : date < new Date(startDate) || date < today;
//                               }}
//                               initialFocus
//                               className="bg-[#222222] text-white"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                         <FormMessage className="text-[11px] text-red-400" />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Description */}
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                         Tour Overview & Itinerary
//                       </FormLabel>
//                       <FormControl>
//                         <textarea
//                           {...field}
//                           rows={4}
//                           className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-xs text-white placeholder-gray-500 focus:border-[#e8822a] focus:outline-none"
//                           placeholder="Provide a comprehensive breakdown of the tour itinerary, inclusions, and guidelines..."
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[11px] text-red-400" />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Multiple Image Uploader Container */}
//                 <div className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-4">
//                   <div className="mb-2 flex items-center justify-between">
//                     <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                       Tour Gallery Images
//                     </span>
//                     <span className="text-[10px] text-gray-500">
//                       At least 1 image required
//                     </span>
//                   </div>
//                   <MultipleImageUploader onChange={setImages} />
//                 </div>

//                 {/* Action Controls */}
//                 <div className="pt-2">
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="h-11 w-full rounded-xl bg-[#e8822a] text-xs font-bold text-white shadow-lg shadow-[#e8822a]/20 transition hover:bg-[#d07323] disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center gap-2">
//                         <Loader2 className="h-4 w-4 animate-spin text-white" />
//                         Publishing Tour...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         <PlusCircle className="h-4 w-4" />
//                         Create Tour Package
//                       </span>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>
//     </PageWrapper>
//   );
// }
