import prisma from "@/lib/prisma";
import RoleToggleButton from "../../../_components/users/RoleToggleButton";

const User = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const { slug } = await params;

    const user = await prisma.user.findUnique({
        where: { id: slug }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-6">Current Role: <span className="font-semibold uppercase text-blue-600">{user.role}</span></p>

            <hr className="my-4" />

            <RoleToggleButton userId={user.id} currentRole={user.role} />
        </div>
    )
}

export default User;