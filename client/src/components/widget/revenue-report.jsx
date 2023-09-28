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
  

const data = [
    {
      month: "12/2021",
      revenue: 100000
    },
    {
      month: "01/2022",
      revenue: 200000
    }, 
    {
      month: "01/2022",
      revenue: 340000
    }, 
    {
      month: "01/2022",
      revenue: 530000
    }, 
    {
      month: "01/2022",
      revenue: 870000
    }, 
    {
      month: "01/2022",
      revenue: 900000
    }
  ]
  
  const Quixote = () => (
    <Document>
          <Page size="A4">
            <View style={styles.container}>
                <View style={styles.nameCompany}>
                  <Text>Công ty TNHH PickBazar</Text>
              </View>
              <View style={styles.titleWrapper}>
                  <View style={styles.title}>
                        <Text>BÁO CÁO DOANH THU THEO THÁNG</Text>
                  </View>
                  <view style={styles.subTitle}>
                      <Text>Từ ngày <Text style={styles.date}>12/20/2023</Text> đến ngày <Text style={styles.date}>20/21/2023</Text></Text>
                  </view>
              </View>
              {/* Table */}
              <View style={styles.header}>
                  <Text style={styles.stt}>STT</Text>
                  <Text style={styles.month}>Thời gian</Text>
                  <Text style={styles.revenue}>Doanh thu</Text>
              </View>
              <View style={styles.table}>
                {data.map((item, index) => {
                  return (
                    <View style={styles.tbody} key={index}>
                      <View style={styles.tr}>
                        <Text
                          style={[styles.td, { width: 150, textAlign: "center" }]}
                        >
                          {index + 1}
                        </Text>
                        <Text style={[styles.td, { width: 400 }]}>{item.month}</Text>
                        <Text
                          style={[styles.td, { width: 500, textAlign: "right" }]}
                        >
                          {item.revenue}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
    
              {/* Total */}
              <View style={styles.totalCountWrapper}>
                <View>
                   <Text>Tổng: </Text>
                </View>
                <View>
                  <Text>12.000.000đ</Text>
                </View>
              </View>
              
              <View style={styles.footer}>
                <View>
                    <Text>Thành phố Hồ Chí Minh, ngày <Text>24</Text> tháng <Text>07</Text> năm <Text>2023</Text></Text>
                </View> 
              </View>
              <View style={styles.footerItem}>
                <Text>Nhân viên lập báo cáo</Text>
              </View>
              <View style={[styles.footerItem, { marginTop: 10}]}>
              	<Text>Phạm Dung Bắc</Text>
              </View>
            </View>
          </Page>
        </Document>
  );
  
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
      nameCompany: {
        fontSize: 14,
        fontWeight: 600
      },
      titleWrapper: {
        display: "flex",
        justifyContent:"center",
        flexDirection: "column",
        alignItems: "center",
      },
      title: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 600,
      },
      subTitle: {
        fontSize: 13
      },
      date: {
        fontWeight: 600
      },
      header: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
      },
      stt: {
        fontSize: 13,
        width: 150,
        padding: "12pt",
        borderRightWidth: 1,
        borderColor: '#F3F4F6',
        textAlign: 'center',
        fontWeight: 700
      },
      month: {
        fontSize: 13,
        width: 400,
        borderRightWidth: 1,
        borderColor: '#F3F4F6',
        textAlign: 'center',
        fontWeight: 700
      },
      revenue: {
        fontSize: 13,
        width: 500,
        textAlign: 'center',
        fontWeight: 700
      }, 
      table: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
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
        fontSize: 13,
        color: "#6B7280",
        padding: "12pt",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        borderStyle: "solid"
        
      },
    
      footer: {
        fontSize: 13,
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
        marginTop: 20
      },
      totalCountWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        fontSize: 14,
        fontWeight: 500
      },
    });
  
  ReactPDF.render(<Quixote />);
  
  
  
  
  
  
  