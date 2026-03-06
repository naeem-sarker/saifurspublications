"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toBengaliNumber } from "@/lib/numberConvert"
import { Badge } from "@/components/ui/badge"

export type OrderData = {
    id: string
    totalAmount: number
    deliveryCharge: number
    status: string
    shippingAddress: string
    createdAt: Date
    user: {
        name: string | null
        phone: string | null
    },
    orderItems: any[];
}


export const columns: ColumnDef<OrderData>[] = [
    {
        accessorKey: "order.id",
        header: "Order ID",
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <span style={{ color: "blue", fontWeight: "500" }}>
                    #{id ? id.slice(-6).toUpperCase() : "N/A"}
                </span>
            );
        }
    },
    {
        accessorKey: "user.name",
        header: "Name",
        cell: ({ row }) => row.original.user?.name || "N/A",
    },
    {
        accessorKey: "user.phone",
        header: "Phone",
        cell: ({ row }) => row.original.user?.phone,
    },
    {
        accessorKey: "totalAmount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmount"))
            return <span className="font-bold text-slate-900">৳{toBengaliNumber(amount)}</span>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
                PENDING: { variant: "outline", label: "Pending" },
                CONFIRMED: { variant: "secondary", label: "Confirmed" },
                SHIPPED: { variant: "secondary", label: "Shipped" },
                DELIVERED: { variant: "default", label: "Delivered" },
                CANCELLED: { variant: "destructive", label: "Cancelled" },
                RETURN: { variant: "destructive", label: "Returned" },
            };

            const config = statusConfig[status] || { variant: "outline", label: status };

            return (
                <Badge variant={config.variant} className="font-medium capitalize">
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                        {format(date, "dd MMM, yyyy")}, {format(date, "hh:mm a")}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/admin/orders/view/${order.id}`} className="w-full">
                                View Order
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]