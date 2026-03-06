"use client"

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InvoiceDocument } from '@/components/common/InvoiceTemplate';

export default function InvoiceButton({ order }: { order: any }) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    if (!isClient) return <Button variant="outline" disabled><Loader2 className="animate-spin" size={16} /></Button>;

    return (
        <PDFDownloadLink document={<InvoiceDocument order={order} />} fileName={`Invoice-${order.id.slice(-6)}.pdf`}>
            {({ loading }) => (
                <Button variant="outline" className="flex items-center gap-2" disabled={loading}>
                    <FileText size={16} />
                    {loading ? "Downloading..." : "Download Invoice"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}