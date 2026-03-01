// "use client"

// import { InvoiceDocument } from '@/components/common/InvoiceTemplate'
import { getSession } from '@/lib/firebase/auth'
// import { PDFDownloadLink } from '@react-pdf/renderer'

// const order = {
//     id: "order_full_id_123456789",
//     createdAt: new Date().toISOString(),
//     name: "Naeem Sarker",
//     phone: "01712345678",
//     address: "House 12, Road 5, Dhanmondi, Dhaka",
//     totalAmount: 1450,
//     user: {
//         name: "Naeem",
//         phone: "01712345678"
//     },
//     items: [
//         {
//             product: { name: "Saifurs Spoken English" },
//             price: 450,
//             quantity: 2
//         },
//         {
//             product: { name: "IELTS Reading Guide" },
//             price: 550,
//             quantity: 1
//         }
//     ]
// }

const Dashboard = async () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* <PDFDownloadLink
                document={<InvoiceDocument order={order} />}
                fileName={`invoice_${order.id.slice(-6)}.pdf`}
                className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md font-medium"
            >
                {({ loading }) => (loading ? 'ইনভয়েস তৈরি হচ্ছে...' : 'Download Invoice')}
            </PDFDownloadLink> */}
        </div>
    )
}

export default Dashboard
