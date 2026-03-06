import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Kalpurush',
    src: '/fonts/Kalpurush.ttf',
});

const styles = StyleSheet.create({
    page: {
        padding: 25,
        fontSize: 10,
        fontFamily: 'Kalpurush',
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
        width: 48,
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
        <Page size="A4" style={styles.page}>
            <View style={styles.headerContainer}>
                <View>
                    <Image src={"/saifurs.png"} style={styles.logo} />
                </View>
                <View style={styles.companyMeta}>
                    <Text style={styles.brandName}>Saifurs Publications</Text>
                    <Text style={styles.contactInfo}>Phone: 01806-426003</Text>
                    <Text style={styles.contactInfo}>Website: www.saifurspublications.com</Text>
                </View>
            </View>

            <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Bill To:</Text>
                    <Text style={styles.valueBold}>Name: {order.user?.name}</Text>
                    <Text>Phone: {order.user?.phone}</Text>
                    <Text style={{ marginTop: 2 }}>Address: {order.shippingAddress}</Text>
                </View>
                <View style={[styles.infoBox, { textAlign: 'right' }]}>
                    <Text style={styles.label}>Order Details:</Text>
                    <Text style={styles.valueBold}>Invoice #{order.id?.slice(-6).toUpperCase()}</Text>
                    <Text>
                        Date: {new Date(order.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </Text>
                    <Text>Payment Method: Cash on Delivery</Text>
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colDesc}>Product Details</Text>
                    <Text style={styles.colQty}>Quantity</Text>
                    <Text style={styles.colPrice}>Price</Text>
                    <Text style={styles.colTotal}>Total</Text>
                </View>

                {order.orderItems?.map((item: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.colDesc}>{item.product?.name}</Text>
                        <Text style={styles.colQty}>{item.quantity}</Text>
                        <Text style={styles.colPrice}>{item.price} TK</Text>
                        <Text style={styles.colTotal}>{item.price * item.quantity} TK</Text>
                    </View>
                ))}
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryLine}>
                        <Text>Sub Total:</Text>
                        <Text>{order.totalAmount - order.deliveryCharge} TK</Text>
                    </View>
                    <View style={styles.summaryLine}>
                        <Text>Delivery Charge:</Text>
                        <Text>{order.deliveryCharge} TK</Text>
                    </View>
                    <View style={[styles.summaryLine, styles.grandTotal]}>
                        <Text>Total:</Text>
                        <Text>{order.totalAmount} TK</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);