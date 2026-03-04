import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// কালপুরুষ ফন্ট রেজিস্টার করা
Font.register({
    family: 'Kalpurush',
    src: '/fonts/Kalpurush.ttf', // আপনার public/fonts ফোল্ডারের পাথ
});

const styles = StyleSheet.create({
    page: { 
        padding: 25, 
        fontSize: 10, 
        fontFamily: 'Kalpurush', // ডিফল্ট ফন্ট কালপুরুষ সেট করা হলো
        color: '#2d3748',
        backgroundColor: '#ffffff' 
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1.5,
        borderColor: '#dc2626',
        paddingBottom: 10,
        marginBottom: 15,
    },
    logo: { 
        width: 90, 
        height: 'auto'
    },
    companyMeta: {
        textAlign: 'right',
    },
    brandName: {
        fontSize: 16,
        fontFamily: 'Kalpurush',
        color: '#dc2626',
    },
    contactInfo: {
        fontSize: 9,
        color: '#4a5568',
        marginTop: 2,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoBox: {
        width: '48%',
    },
    label: {
        fontSize: 8,
        textTransform: 'uppercase',
        color: '#718096',
        marginBottom: 3,
    },
    valueBold: {
        fontSize: 11,
        fontFamily: 'Kalpurush',
        color: '#1a202c'
    },
    table: {
        width: 'auto',
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderBottom: 1,
        borderColor: '#cbd5e1',
        paddingVertical: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: 0.5,
        borderColor: '#e2e8f0',
        paddingVertical: 6,
    },
    colDesc: { width: '55%', paddingLeft: 5 },
    colQty: { width: '10%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right', paddingRight: 5 },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summaryBox: {
        width: '35%',
        borderTop: 1,
        borderColor: '#dc2626',
        paddingTop: 5,
    },
    summaryLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    grandTotal: {
        fontSize: 12,
        color: '#dc2626',
        marginTop: 4,
    }
});

export const InvoiceDocument = ({ order }: { order: any }) => (
    <Document>
        <Page size="A5" orientation="landscape" style={styles.page}>
            {/* Header Area */}
            <View style={styles.headerContainer}>
                <View>
                    <Image src="https://i.ibb.co/L6vV9tF/saifurs-logo.png" style={styles.logo} />
                </View>
                <View style={styles.companyMeta}>
                    <Text style={styles.brandName}>সাইফুরস পাবলিকেশনস</Text>
                    <Text style={styles.contactInfo}>ফোন: +৮৮০ ১৩২১-১৪৫৪৫৫</Text>
                    <Text style={styles.contactInfo}>ওয়েব: www.saifurs.com</Text>
                </View>
            </View>

            {/* Customer & Order Data */}
            <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>বিল টু (Bill To):</Text>
                    <Text style={styles.valueBold}>{order.user?.name}</Text>
                    <Text style={{ marginTop: 2 }}>{order.shippingAddress}</Text>
                    <Text>ফোন: {order.user?.phone}</Text>
                </View>
                <View style={[styles.infoBox, { textAlign: 'right' }]}>
                    <Text style={styles.label}>অর্ডার ডিটেইলস:</Text>
                    <Text style={styles.valueBold}>ইনভয়েস #{order.id?.slice(-6).toUpperCase()}</Text>
                    <Text>তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD')}</Text>
                    <Text>পেমেন্ট: ক্যাশ অন ডেলিভারি</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colDesc}>বইয়ের বিবরণ</Text>
                    <Text style={styles.colQty}>পরিমাণ</Text>
                    <Text style={styles.colPrice}>মূল্য</Text>
                    <Text style={styles.colTotal}>মোট</Text>
                </View>
                
                {order.orderItems?.map((item: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.colDesc}>{item.product?.name}</Text>
                        <Text style={styles.colQty}>{item.quantity}</Text>
                        <Text style={styles.colPrice}>{item.price} টাকা</Text>
                        <Text style={styles.colTotal}>{item.price * item.quantity} টাকা</Text>
                    </View>
                ))}
            </View>

            {/* Final Amount */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryLine}>
                        <Text>সাবটোটাল:</Text>
                        <Text>{order.totalAmount - order.deliveryCharge} টাকা</Text>
                    </View>
                    <View style={styles.summaryLine}>
                        <Text>ডেলিভারি চার্জ:</Text>
                        <Text>{order.deliveryCharge} টাকা</Text>
                    </View>
                    <View style={[styles.summaryLine, styles.grandTotal]}>
                        <Text>সর্বমোট প্রদেয়:</Text>
                        <Text>{order.totalAmount} টাকা</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);