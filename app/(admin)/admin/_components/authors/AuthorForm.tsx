"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import Image from "next/image"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"
import { createAuthor, updateAuthor } from "@/actions/authorActions"
import { redirect } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    avatarUrl: z
        .any()
        .optional(),
    isActive: z.boolean().default(true),
})

export function AuthorForm({ initialData }: { initialData?: any }) {
    const [preview, setPreview] = React.useState<string | null>(initialData?.avatarUrl || null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
            avatarUrl: initialData?.avatarUrl || "",
            isActive: initialData !== undefined ? initialData.isActive : true,
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
        const file = e.target.files?.[0]
        if (file) {
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error("Image size must be less than 2MB");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setPreview(result)
                onChange(result)
            }
            reader.readAsDataURL(file)
        }
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description || "");
        formData.append("isActive", String(data.isActive));

        if (fileInputRef.current?.files?.[0]) {
            formData.append("image", fileInputRef.current.files[0]);
        }

        const res = initialData ? await updateAuthor(initialData.id, formData) : await createAuthor(formData);

        if (res.success) {
            toast.success(res.message)
            form.reset()
            setPreview(null)
            redirect("/admin/authors")
        } else {
            toast.error(res.message)
        }
    }

    return (
        <Card className="w-full mx-auto border-none  bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-8">
                <form id="author-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left Side: Inputs & Status */}
                        <div className="space-y-5">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-sm font-semibold">Author Name</FieldLabel>
                                        <Input {...field} placeholder="e.g. John Doe" className="bg-background" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="slug"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="text-sm font-semibold">Author Slug</FieldLabel>
                                        <Input {...field} placeholder="john-doe" className="bg-background" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            {/* isActive Switch Section */}
                            <Controller
                                name="isActive"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium">Active Status</span>
                                            <span className="text-xs text-muted-foreground">Make author visible</span>
                                        </div>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        {/* Right Side: Image Upload Block */}
                        <Controller
                            name="avatarUrl"
                            control={form.control}
                            render={({ field: { onChange, value, ...field }, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="h-full">
                                    <FieldLabel className="text-sm font-semibold">Profile Image</FieldLabel>
                                    <div
                                        onClick={() => !preview && fileInputRef.current?.click()}
                                        className={`relative flex flex-col items-center justify-center w-full h-full min-h-[160px] border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
                                            ${preview ? "border-solid border-primary" : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"}
                                        `}
                                    >
                                        {preview ? (
                                            <>
                                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setPreview(null); onChange(""); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-destructive transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-center p-4">
                                                <div className="mb-2 p-3 bg-muted rounded-full">
                                                    <Upload size={20} className="text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium">Click to upload</p>
                                                <p className="text-[10px] text-muted-foreground mt-1 uppercase">JPG, PNG (max 5mb)</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, onChange)}
                                        />
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-sm font-semibold">Description</FieldLabel>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        placeholder="Brief biography..."
                                        rows={4}
                                        className="bg-background resize-none"
                                    />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t bg-muted/10 px-6 py-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => { form.reset(); setPreview(null); }}
                >
                    Clear Form
                </Button>
                <Button
                    type="submit"
                    form="author-form"
                    className="min-w-[120px] shadow-md shadow-primary/20"
                >
                    {initialData ? "Update Author" : "Save Author"}
                </Button>
            </CardFooter>
        </Card>
    )
}