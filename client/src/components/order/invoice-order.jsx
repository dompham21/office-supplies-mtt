import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
  } from "@react-pdf/renderer";
import { formatAddress } from "@utils/format-address";
import { currencyMoney } from "@utils/format-currency";
import { formatDate } from "@utils/format-date";
  
  const calSubTotal = (order) => {
    if(order) {
        return order?.totalPrice;
    }
  }

  const calTotal = (order) => {
    if(order) {
        return order?.totalPrice;
    }
  }

  export default function InvoicePdf({ order }) {
    return (
      <Document>
        <Page size="A4">
          <View style={styles.container}>
            {/* Address */}
            <View style={styles.addressWrapper}>
              <View style={styles.section}>
                <Text style={[styles.addressText, { marginBottom: 20 }]}>
                  Invoice No:
                  <Text style={{ color: "#374151", fontFamily: "Roboto", fontWeight: 600 }}>
                    {order.id}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.addressText,
                    { color: "#374151", fontFamily: "Roboto", fontSize: 12, fontWeight: 600 },
                  ]}
                >
                  {order?.user?.name}
                </Text>
                <Text style={styles.addressText}>{order?.user?.email}</Text>
                <Text style={styles.addressText}>{order?.user?.phone}</Text>
                <Text style={styles.addressText}>
                    {formatAddress(order?.address)}
                </Text>
              </View>
  
              <View style={[styles.section]}>
                <Text style={[styles.addressTextRight, { marginBottom: 20 }]}>
                  Date: {formatDate(order?.date)}
                </Text>
                <Text
                  style={[
                    styles.addressTextRight,
                    { color: "#374151", fontFamily: "Roboto", fontSize: 12, fontWeight: 600 },
                  ]}
                >
                  Pickbazar
                </Text>
                <Text style={styles.addressTextRight}>pickbazar@dummy.com</Text>
                <Text style={styles.addressTextRight}>+123456789</Text>
                <Text style={styles.addressTextRight}>
                  21 Jump Street, CA, California
                </Text>
              </View>
            </View>
  
            {/* Table */}
            <View style={styles.orderTable}>
              {order.orderDetails.map((od, index) => {
                return (
                  <View style={styles.tbody} key={index}>
                    <View style={styles.tr}>
                      <Text
                        style={[styles.td, { width: 50, textAlign: "center" }]}
                      >
                        {index + 1}
                      </Text>
                      <Text style={[styles.td, { flex: 1 }]}>{od?.product?.name}</Text>
                      <Text
                        style={[styles.td, { width: 100, textAlign: "right" }]}
                      >
                        {od?.product?.price}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
  
            {/* Border */}
            <View style={styles.singleBorder} />
  
            {/* Total */}
            <View style={styles.totalCountWrapper}>
              <View style={styles.totalCountRow}>
                <Text style={styles.totalCountCell}>Sub Total</Text>
                <Text style={styles.totalCountCell}>{currencyMoney(calSubTotal(order))}</Text>
              </View>
              <View style={styles.totalCountRow}>
                <Text style={styles.totalCountCell}>Discount</Text>
                <Text style={styles.totalCountCell}>{0}</Text>
              </View>
              <View style={styles.totalCountRow}>
                <Text style={styles.totalCountCell}>Delivery Fee</Text>
                <Text style={styles.totalCountCell}>{0}</Text>
              </View>
              <View style={styles.totalCountRow}>
                <Text
                  style={[
                    styles.totalCountCell,
                    { fontSize: 12, fontFamily: "Roboto", fontWeight: 600 },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.totalCountCell,
                    { fontSize: 12, fontFamily: "Roboto", fontWeight: 600 },
                  ]}
                >
                  {currencyMoney(calTotal(order))}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );
  }
  

  
  Font.register({
    family: "Roboto",
    fonts: [
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
      { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
    ],
  })
  
  const styles = StyleSheet.create({
    container: {
      maxWidth: 600,
      flex: 1,
      margin: "50pt",
      fontFamily: "Roboto",
    },
  
    addressWrapper: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 30,
    },
  
    section: {
      width: "40%",
      display: "flex",
      flexDirection: "column",
    },
  
    addressText: {
      fontSize: 11,
      color: "#6B7280",
      fontWeight: 400,
      marginBottom: 5,
    },
    addressTextRight: {
      fontSize: 11,
      color: "#6B7280",
      fontWeight: 400,
      marginBottom: 5,
      textAlign: "right",
    },
  
    orderTable: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
  
    thead: {
      width: "100%",
      backgroundColor: "#F3F4F6",
      display: "flex",
      flexDirection: "row",
    },
  
    th: {
      fontSize: 11,
      fontFamily: "Roboto",
      color: "#374151",
      padding: "12pt 16pt",
      borderRightWidth: 1,
      borderRightColor: "#ffffff",
      borderRightStyle: "solid",
    },
  
    tbody: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
  
    tr: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
  
    td: {
      fontSize: 11,
      color: "#6B7280",
      padding: "12pt 16pt",
      borderTopWidth: 1,
      borderTopColor: "#F3F4F6",
      borderTopStyle: "solid",
      borderRightWidth: 1,
      borderRightColor: "#ffffff",
      borderRightStyle: "solid",
    },
  
    singleBorder: {
      width: "50%",
      display: "flex",
      marginLeft: "auto",
      borderTopWidth: 1,
      borderTopColor: "#F3F4F6",
      borderTopStyle: "solid",
      marginBottom: 2,
    },
  
    totalCountWrapper: {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      marginLeft: "auto",
      borderTopWidth: 1,
      borderTopColor: "#F3F4F6",
      borderTopStyle: "solid",
    },
  
    totalCountRow: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  
    totalCountCell: {
      fontSize: 11,
      color: "#6B7280",
      padding: "8pt 16pt 2pt",
    },
  });
  