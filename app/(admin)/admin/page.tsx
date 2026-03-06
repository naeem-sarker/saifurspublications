import { Users, ShoppingCart, Package, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getStats } from "@/actions/statsActions";
import { getOrders } from "@/actions/orderActions";

const Dashboard = async () => {
    const res = await getStats();
    const ores = await getOrders(1, 10);

    const stats = [
        { title: "Total Users", value: res.data?.users, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Orders", value: res.data?.orders, icon: ShoppingCart, color: "text-green-600", bg: "bg-green-100" },
        { title: "Total Products", value: res.data?.products, icon: Package, color: "text-orange-600", bg: "bg-orange-100" },
        { title: "Total Authors", value: res.data?.authors, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl'>Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4">
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="grid gap-1">
                            <CardTitle className="text-xl">Recent Orders</CardTitle>
                            <CardDescription>You have 12 pending orders to review.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/orders">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden md:table-cell">Product</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ores?.data?.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium text-blue-600">#{order.id?.slice(-6).toUpperCase()}</TableCell>
                                        <TableCell>Naeem Sarker</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">IELTS</TableCell>
                                        <TableCell>{order.totalAmount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={order.status === "DELIVERED" ? "default" : "secondary"}
                                                className={
                                                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" : ""
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">23 March</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;