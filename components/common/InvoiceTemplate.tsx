import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { 
        padding: 25, 
        fontSize: 9, 
        fontFamily: 'Helvetica', 
        color: '#2d3748',
        backgroundColor: '#ffffff' 
    },
    // Header Section
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    contactInfo: {
        fontSize: 8,
        color: '#4a5568',
        marginTop: 2,
    },

    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoBox: {
        width: '48%',
    },
    label: {
        fontSize: 7,
        textTransform: 'uppercase',
        color: '#718096',
        fontWeight: 'bold',
        marginBottom: 3,
    },
    valueBold: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Table
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

    // Totals
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
        fontSize: 11,
        fontWeight: 'bold',
        color: '#dc2626',
        marginTop: 4,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 25,
        right: 25,
        textAlign: 'center',
        borderTop: 0.5,
        borderColor: '#e2e8f0',
        paddingTop: 8,
        fontSize: 7.5,
        color: '#718096',
    }
});

export const InvoiceDocument = ({ order }) => (
    <Document>
        <Page size="A5" orientation="landscape" style={styles.page}>
            {/* Header with Logo & Contact */}
            <View style={styles.headerContainer}>
                <View>
                    <Image src="https://i.ibb.co/L6vV9tF/saifurs-logo.png" style={styles.logo} />
                </View>
                <View style={styles.companyMeta}>
                    <Text style={styles.brandName}>Saifurs Publications</Text>
                    <Text style={styles.contactInfo}>Phone: +880 1234-567890</Text>
                    <Text style={styles.contactInfo}>Web: www.saifurs.com</Text>
                </View>
            </View>

            {/* Customer & Order Data */}
            <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Bill To:</Text>
                    <Text style={styles.valueBold}>{order.user?.name || order.name}</Text>
                    <Text>{order.address}</Text>
                    <Text>Phone: {order.user?.phone || order.phone}</Text>
                </View>
                <View style={[styles.infoBox, { textAlign: 'right' }]}>
                    <Text style={styles.label}>Order Details:</Text>
                    <Text style={styles.valueBold}>Invoice #{order.id.slice(-6).toUpperCase()}</Text>
                    <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
                    <Text>Payment: Cash on Delivery</Text>
                </View>
            </View>

            {/* Compact Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.colDesc, { fontWeight: 'bold' }]}>Item Description</Text>
                    <Text style={[styles.colQty, { fontWeight: 'bold' }]}>Qty</Text>
                    <Text style={[styles.colPrice, { fontWeight: 'bold' }]}>Price</Text>
                    <Text style={[styles.colTotal, { fontWeight: 'bold' }]}>Total</Text>
                </View>
                
                {order.items.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.colDesc}>{item.product.name}</Text>
                        <Text style={styles.colQty}>{item.quantity}</Text>
                        <Text style={styles.colPrice}>{item.price} TK</Text>
                        <Text style={styles.colTotal}>{item.price * item.quantity} TK</Text>
                    </View>
                ))}
            </View>

            {/* Final Amount */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryLine}>
                        <Text>Subtotal:</Text>
                        <Text>{order.totalAmount} TK</Text>
                    </View>
                    <View style={styles.summaryLine}>
                        <Text>Shipping:</Text>
                        <Text>0 TK</Text>
                    </View>
                    <View style={[styles.summaryLine, styles.grandTotal]}>
                        <Text>Total Payable:</Text>
                        <Text>{order.totalAmount} TK</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);