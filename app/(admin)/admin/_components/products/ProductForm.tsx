"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import Image from "next/image"
import {
    Upload, FileText, Star, TrendingUp,
    CheckCircle2, Package, Layers,
    Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, updateProduct } from "@/actions/productActions"
import { useRouter } from "next/navigation"

const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim();
};

type ProductFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    type: z.enum(["BOOK", "STATIONARY"]),
    name: z.string().min(1, "Product name is required"),
    slug: z.string().min(1, "Slug is required"),
    regularPrice: z.coerce.number().min(0).default(0),
    salePrice: z.coerce.number().min(0).default(0),
    discountRate: z.coerce.number().min(0).max(100).default(0),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isPopular: z.boolean().default(false),
    isStock: z.boolean().default(true),
    isDeliveryFree: z.boolean().default(false),
    authors: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    edition: z.string().optional().nullable(),
    totalPage: z.coerce.number().optional().nullable(),
    pdfUrl: z.any().optional(),
})

export default function ProductForm({ initialData, authorsList, categoriesList }: { initialData?: any, authorsList: any[], categoriesList: any[] }) {
    const router = useRouter();
    const [preview, setPreview] = React.useState<string | null>(initialData?.coverImg || null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const pdfInputRef = React.useRef<HTMLInputElement>(null)
    const [loading, setLoading] = React.useState(false);

    console.log(initialData, "Initial Data")


    const formattedInitialData = React.useMemo(() => {
        if (!initialData) return undefined;
        return {
            ...initialData,
            authors: initialData.authors?.map((a: any) => a.id || a) || [],
            categories: initialData.categories?.map((c: any) => c.id || c) || [],
        };
    }, [initialData]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema as any),
        defaultValues: formattedInitialData || {
            type: "BOOK",
            name: "",
            slug: "",
            regularPrice: 0,
            salePrice: 0,
            discountRate: 0,
            isStock: true,
            isDeliveryFree: false,
            isFeatured: false,
            isPopular: false,
            isActive: true,
            authors: [],
            categories: [],
            edition: "",
            totalPage: 0,
            pdfUrl: undefined
        }
    })

    const watchType = form.watch("type");
    const watchRegularPrice = form.watch("regularPrice");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue("name", name);
        if (!initialData) form.setValue("slug", generateSlug(name));
    };

    const handleDiscountChange = (rate: number) => {
        const price = watchRegularPrice - (watchRegularPrice * rate) / 100;
        form.setValue("salePrice", Math.ceil(price));
        form.setValue("discountRate", rate);
    }

    const handleSalePriceChange = (sPrice: number) => {
        if (watchRegularPrice > 0) {
            const rate = ((watchRegularPrice - sPrice) / watchRegularPrice) * 100;
            form.setValue("discountRate", Math.floor(rate));
        }
        form.setValue("salePrice", sPrice);
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key !== "authors" && key !== "categories" && key !== "pdfUrl") {
                    formData.append(key, String(value ?? ""));
                }
            });

            formData.append("authors", JSON.stringify(data.authors));
            formData.append("categories", JSON.stringify(data.categories));

            if (fileInputRef.current?.files?.[0]) {
                formData.append("coverImg", fileInputRef.current.files[0]);
            }
            if (pdfInputRef.current?.files?.[0]) {
                formData.append("pdfUrl", pdfInputRef.current.files[0]);
            }

            const res = initialData
                ? await updateProduct(initialData.id, formData)
                : await createProduct(formData);

            if (res.success) {
                toast.success(res.message)
                router.push("/admin/products")
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("An error occurred while saving the product. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl mx-auto pb-20">
            <Card className="overflow-hidden">
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="space-y-6">
                            <FieldLabel className="text-sm font-bold flex items-center gap-2"><Upload size={16} /> Cover Image</FieldLabel>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden"
                            >
                                {preview ? (
                                    <>
                                        <Image src={preview.startsWith('data:') ? preview : `/api${preview}`} alt="Cover" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs font-bold">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 text-muted-foreground">
                                        <Upload className="mx-auto mb-2 opacity-50" />
                                        <p className="text-[10px] uppercase font-bold tracking-widest">Select Image</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setPreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }} />

                            <div className="grid grid-cols-1 gap-2 p-4 bg-muted/20 rounded-2xl border">
                                {[
                                    { id: "isActive", label: "Active", icon: <CheckCircle2 size={14} className="text-green-500" /> },
                                    { id: "isFeatured", label: "Featured", icon: <Star size={14} className="text-yellow-500" /> },
                                    { id: "isPopular", label: "Popular", icon: <TrendingUp size={14} className="text-blue-500" /> },
                                    { id: "isStock", label: "In Stock", icon: <Package size={14} className="text-orange-500" /> },
                                    { id: "isDeliveryFree", label: "Free Shipping", icon: <Layers size={14} className="text-purple-500" /> },
                                ].map((item) => (
                                    <Controller key={item.id} name={item.id as any} control={form.control} render={({ field }) => (
                                        <div className="flex items-center justify-between p-2">
                                            <span className="text-xs font-bold flex items-center gap-2 uppercase tracking-tighter opacity-70">{item.icon} {item.label}</span>
                                            <Switch className="scale-75" checked={!!field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )} />
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Controller name="type" control={form.control} render={({ field }) => (
                                    <Field><FieldLabel>Product Type</FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="bg-muted/10 h-12 font-medium"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BOOK">Book</SelectItem>
                                                <SelectItem value="STATIONARY">Stationary</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )} />
                                <Controller name="name" control={form.control} render={({ field }) => (
                                    <Field><FieldLabel>Product Title</FieldLabel>
                                        <Input {...field} onChange={handleNameChange} className="h-12 bg-muted/10 font-medium" />
                                    </Field>
                                )} />
                            </div>

                            <Controller name="slug" control={form.control} render={({ field }) => (
                                <Field><FieldLabel>URL Slug</FieldLabel>
                                    <Input {...field} className="h-10 bg-muted/5 text-muted-foreground font-mono text-xs" />
                                </Field>
                            )} />

                            <div className="grid grid-cols-3 gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                <Controller name="regularPrice" control={form.control} render={({ field }) => (
                                    <Field><FieldLabel className="text-[10px] uppercase font-bold">Regular (৳)</FieldLabel>
                                        <Input type="number" className="bg-background text-xl font-black h-14" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </Field>
                                )} />
                                <Controller name="discountRate" control={form.control} render={({ field }) => (
                                    <Field><FieldLabel className="text-[10px] uppercase font-bold text-red-500">Discount %</FieldLabel>
                                        <Input type="number" className="bg-background text-xl font-black h-14 text-red-500" {...field} onChange={(e) => handleDiscountChange(Number(e.target.value))} />
                                    </Field>
                                )} />
                                <Controller name="salePrice" control={form.control} render={({ field }) => (
                                    <Field><FieldLabel className="text-[10px] uppercase font-bold text-green-600">Sale (৳)</FieldLabel>
                                        <Input type="number" className="bg-background text-xl font-black h-14 text-green-600" {...field} onChange={(e) => handleSalePriceChange(Number(e.target.value))} />
                                    </Field>
                                )} />
                            </div>

                            {watchType === "BOOK" && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <FieldLabel>Select Authors</FieldLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border rounded-2xl bg-muted/5 max-h-40 overflow-y-auto">
                                            {authorsList.map((author) => (
                                                <label key={author.id} className="flex items-center gap-2 text-[11px] font-medium cursor-pointer">
                                                    <input type="checkbox" className="accent-primary"
                                                        checked={form.watch("authors")?.includes(author.id) || false}
                                                        onChange={(e) => {
                                                            const val = form.getValues("authors") || [];
                                                            form.setValue("authors", e.target.checked ? [...val, author.id] : val.filter(id => id !== author.id))
                                                        }}
                                                    /> {author.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Controller name="edition" control={form.control} render={({ field }) => (
                                            <Field><FieldLabel>Edition</FieldLabel><Input className="bg-muted/10" {...field} value={field.value || ""} /></Field>
                                        )} />
                                        <Controller name="totalPage" control={form.control} render={({ field }) => (
                                            <Field><FieldLabel>Pages</FieldLabel><Input type="number" className="bg-muted/10" {...field} value={field.value || 0} /></Field>
                                        )} />
                                        <Field><FieldLabel>Preview PDF</FieldLabel>
                                            <div onClick={() => pdfInputRef.current?.click()} className="flex items-center justify-center gap-2 h-10 border rounded-xl bg-red-50 cursor-pointer text-red-600">
                                                <FileText size={16} />
                                                <span className="text-[10px] font-bold uppercase truncate px-2">
                                                    {pdfInputRef.current?.files?.[0]?.name || (initialData?.pdfUrl ? <span>{initialData.pdfUrl.split('/').pop()}</span> : "Attach PDF")}
                                                </span>
                                            </div>
                                            <input type="file" ref={pdfInputRef} hidden accept="application/pdf" />
                                        </Field>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <FieldLabel>Select Categories</FieldLabel>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border rounded-2xl bg-muted/5">
                                    {categoriesList.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-2 text-[11px] font-medium cursor-pointer">
                                            <input type="checkbox" className="accent-primary"
                                                checked={form.watch("categories")?.includes(cat.id) || false}
                                                onChange={(e) => {
                                                    const val = form.getValues("categories") || [];
                                                    form.setValue("categories", e.target.checked ? [...val, cat.id] : val.filter(id => id !== cat.id))
                                                }}
                                            /> {cat.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 p-8 bg-muted/30 border-t">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" className="rounded-full bg-primary px-12 font-bold">
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? (initialData ? "Updating..." : "Saving...") : (initialData ? "Update Product" : "Save Product")}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}