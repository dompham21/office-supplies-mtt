export default function convertToUSD(amountInVND) {
    // Tỉ giá chuyển đổi từ VND sang USD
    const exchangeRate = 0.000043; // Tỉ giá tạm thời, bạn cần cập nhật tỉ giá thực tế
  
    // Chuyển đổi số tiền từ VND sang USD
    const amountInUSD = amountInVND * exchangeRate;
  
    // Làm tròn số tiền đến 2 chữ số sau dấu phẩy
    const roundedAmountInUSD = Math.round(amountInUSD * 100) / 100;
  
    return roundedAmountInUSD;
  }
  