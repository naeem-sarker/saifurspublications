"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"
import { createCategory } from "@/actions/categoryActions"

const formSchema = z.object({
    name: z.string(),
    slug: z.string(),
})

export function CategoryForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {

        const res = await createCategory(data);

        if (res.success) {
            toast.success(res.message)
            form.reset()
            redirect("/admin/categories")
        } else {
            toast.error(res.message)
        }
    }

    return (
        <Card className="w-full">
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="flex flex-row gap-8">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-name">
                                            Category Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter category name"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="slug"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-slug">
                                            Category Slug
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-slug"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="john-doe"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" className="cursor-pointer" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" className="cursor-pointer" form="form-rhf-demo">
                        Submit
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
