package com.luv2code.doan.service.impl;

import com.luv2code.doan.bean.*;
import com.luv2code.doan.entity.Order;
import com.luv2code.doan.entity.OrderReasonCancel;
import com.luv2code.doan.entity.OrderStatus;
import com.luv2code.doan.exceptions.OrderStatusNotFoundException;
import com.luv2code.doan.repository.ReportRepository;
import com.luv2code.doan.service.OrderReasonCancelService;
import com.luv2code.doan.service.OrderStatusService;
import com.luv2code.doan.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportRepository reportRepository;


    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private OrderReasonCancelService orderReasonCancelService;

    public long getTotalReviewInMonth() {
        Date currentDate = new Date();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_MONTH, -30);
        Date date30DaysAgo = calendar.getTime();

        return reportRepository.countReviewCreatedWithin30Days(date30DaysAgo);
    }

    public long getTotalUserInMonth() {
        Date currentDate = new Date();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_MONTH, -30);
        Date date30DaysAgo = calendar.getTime();

        return reportRepository.countUsersRegisteredWithin30Days(date30DaysAgo);
    }

    public long getTotalOrderInMonth() {
        Date currentDate = new Date();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_MONTH, -30);
        Date date30DaysAgo = calendar.getTime();

        return reportRepository.countOrderCreatedWithin30Days(date30DaysAgo);
    }


    public double getTotalRevenueInMonth() {
        double total = 0.0;

        List<Object[]> results = reportRepository.getRevenueOfNDay(30);

        for (Object[] result : results) {
            total += (Double) result[1];

        }
        return total;
    }


    public List<SaleHistoryItem> getSaleHistoryByYear() {

        Calendar c = Calendar.getInstance();
        int currYear = c.get(Calendar.YEAR);
        int currMonth = c.get(Calendar.MONTH) + 1;

        YearMonth current = YearMonth.of(currYear, currMonth);


        List<SaleHistoryItem> list = new ArrayList<>();


        for (int i = 11; i >= 0; i--) {
            SaleHistoryItem item = new SaleHistoryItem();

            YearMonth yearMonth = current.minusMonths(i);

            int month = yearMonth.getMonth().getValue();
            int year = yearMonth.getYear();
            item.setName(capitalizeFirstLetter(yearMonth.getMonth().toString().toLowerCase(Locale.ROOT)) + ", " + year);
            item.setValue(reportRepository.getTotalRevenueInMonth(month, year));

            list.add(item);
        }

        return list;
    }


    public List<SaleHistoryItem> getBuyHistoryOfUserByYear(Integer userId) {

        Calendar c = Calendar.getInstance();
        int currYear = c.get(Calendar.YEAR);
        int currMonth = c.get(Calendar.MONTH) + 1;

        YearMonth current = YearMonth.of(currYear, currMonth);


        List<SaleHistoryItem> list = new ArrayList<>();

        for (int i = 11; i >= 0; i--) {
            SaleHistoryItem item = new SaleHistoryItem();

            YearMonth yearMonth = current.minusMonths(i);

            int month = yearMonth.getMonth().getValue();
            int year = yearMonth.getYear();
            item.setName(capitalizeFirstLetter(yearMonth.getMonth().toString().toLowerCase(Locale.ROOT)) + ", " + year);
            item.setValue(reportRepository.getTotalReviewInMonthOfUser(month, year, userId));

            list.add(item);
        }

        return list;
    }

    public List<SaleHistoryItem> getBuyHistoryByMonthOfUser(Integer userId) {
        List<SaleHistoryItem> list = new ArrayList<>();

        for (int i = 29; i >= 0; i--) {
            SaleHistoryItem item = new SaleHistoryItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.totalBuyHistoryByDateOfUser(d, userId));

            list.add(item);
        }

        return list;
    }

    public List<SaleHistoryItem> getBuyHistoryByWeek(Integer userId) {
        List<SaleHistoryItem> list = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            SaleHistoryItem item = new SaleHistoryItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.totalBuyHistoryByDateOfUser(d, userId));

            list.add(item);
        }

        return list;
    }

    public List<SaleHistoryItem> getSaleHistoryByMonth() {
        List<SaleHistoryItem> list = new ArrayList<>();

        for (int i = 29; i >= 0; i--) {
            SaleHistoryItem item = new SaleHistoryItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.totalEarnByDate(d));

            list.add(item);
        }

        return list;
    }

    public List<SaleHistoryItem> getSaleHistoryByWeek() {
        List<SaleHistoryItem> list = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            SaleHistoryItem item = new SaleHistoryItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.totalEarnByDate(d));

            list.add(item);
        }

        return list;
    }

    public List<ReportItem> reportOrder(Integer type) throws OrderStatusNotFoundException {

        List<ReportItem> list = new ArrayList<>();

        List<OrderStatus> listOrderStatus = orderStatusService.listOrderStatus();

        for(OrderStatus os : listOrderStatus) {
            ReportItem item = new ReportItem();
            item.setName(os.getName());
            switch (type){
                case 0: { // year
                    item.setValue(countOrderByYearAndStatusId(os.getId()));
                    break;
                }
                case 1: { //month
                    item.setValue(countOrderByMonthAndStatusId(os.getId()));
                    break;
                }
                case 2: { //week
                    item.setValue(countOrderByWeekAndStatusId(os.getId()));
                    break;
                }
            }

            list.add(item);
        }

        return list;
    }

    public List<ReportItem> reportOrderCancel(Integer type) {

        List<ReportItem> list = new ArrayList<>();


        List<OrderReasonCancel> listOrderStatus = orderReasonCancelService.listOrderReasonCancel();

        for(OrderReasonCancel reason : listOrderStatus) {
            ReportItem item = new ReportItem();
            item.setName(reason.getName());
            switch (type){
                case 0: { // year
                    item.setValue(countOrderCancelByYearAndReason(reason.getId()));
                    break;
                }
                case 1: { //month
                    item.setValue(countOrderCancelByMonthAndReason(reason.getId()));
                    break;
                }
                case 2: { //week
                    item.setValue(countOrderCancelByWeekAndReason(reason.getId()));
                    break;
                }
            }

            list.add(item);
        }

        return list;
    }

    public long countOrderByWeekAndStatusId(Integer statusId) throws OrderStatusNotFoundException {
        OrderStatus orderStatus = orderStatusService.getOrderStatusById(statusId);
        return reportRepository.countOrderByWeekAndStatusId(orderStatus.getId());
    }

    public long countOrderByMonthAndStatusId(Integer statusId) throws OrderStatusNotFoundException {
        OrderStatus orderStatus = orderStatusService.getOrderStatusById(statusId);
        return reportRepository.countOrderByMonthAndStatusId(orderStatus.getId());
    }

    public long countOrderByYearAndStatusId(Integer statusId) throws OrderStatusNotFoundException {
        OrderStatus orderStatus = orderStatusService.getOrderStatusById(statusId);
        return reportRepository.countOrderByYearAndStatusId(orderStatus.getId());
    }

    @Override
    public long countOrderByWeek() {
        return reportRepository.countOrderByWeek();
    }

    @Override
    public long countOrderByMonth() {
        return reportRepository.countOrderByMonth();
    }

    @Override
    public long countOrderByYear() {
        return reportRepository.countOrderByYear();
    }

    public long countOrderCancelByWeekAndReason(int reason) {
        return reportRepository.countListOrderCancelByWeekAndReason(reason);
    }

    public long countOrderCancelByMonthAndReason(int reason) {
        return reportRepository.countListOrderCancelByMonthAndReason(reason);
    }

    public long countOrderCancelByYearAndReason(int reason) {
        return reportRepository.countListOrderCancelByYearAndReason(reason);
    }

    public List<ReportItem> getOverviewUserByWeek() {
        List<ReportItem> list = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            ReportItem item = new ReportItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.countUserByDate(d));

            list.add(item);
        }

        return list;
    }

    public List<ReportItem> getOverviewUserByMonth() {
        List<ReportItem> list = new ArrayList<>();

        for (int i = 29; i >= 0; i--) {
            ReportItem item = new ReportItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.countUserByDate(d));

            list.add(item);
        }

        return list;
    }


    public List<ReportItem> getOverviewUserByYear() {

        Calendar c = Calendar.getInstance();
        int currYear = c.get(Calendar.YEAR);
        int currMonth = c.get(Calendar.MONTH) + 1;

        YearMonth current = YearMonth.of(currYear, currMonth);


        List<ReportItem> list = new ArrayList<>();


        for (int i = 11; i >= 0; i--) {
            ReportItem item = new ReportItem();

            YearMonth yearMonth = current.minusMonths(i);

            int month = yearMonth.getMonth().getValue();
            int year = yearMonth.getYear();
            item.setName(capitalizeFirstLetter(yearMonth.getMonth().toString().toLowerCase(Locale.ROOT)) + ", " + year);
            item.setValue(reportRepository.countUserInMonth(month, year));

            list.add(item);
        }

        return list;
    }


    public List<ReportItem> getOverviewReviewByWeek() {
        List<ReportItem> list = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            ReportItem item = new ReportItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.countReviewByDate(d));

            list.add(item);
        }

        return list;
    }

    public List<ReportItem> getOverviewReviewByMonth() {
        List<ReportItem> list = new ArrayList<>();

        for (int i = 29; i >= 0; i--) {
            ReportItem item = new ReportItem();
            Date d = subDays(new Date(), i);

            item.setName(convertDayToString(d));
            item.setValue(reportRepository.countReviewByDate(d));

            list.add(item);
        }

        return list;
    }


    public List<ReportItem> getOverviewReviewByYear() {

        Calendar c = Calendar.getInstance();
        int currYear = c.get(Calendar.YEAR);
        int currMonth = c.get(Calendar.MONTH) + 1;

        YearMonth current = YearMonth.of(currYear, currMonth);


        List<ReportItem> list = new ArrayList<>();


        for (int i = 11; i >= 0; i--) {
            ReportItem item = new ReportItem();

            YearMonth yearMonth = current.minusMonths(i);

            int month = yearMonth.getMonth().getValue();
            int year = yearMonth.getYear();
            item.setName(capitalizeFirstLetter(yearMonth.getMonth().toString().toLowerCase(Locale.ROOT)) + ", " + year);
            item.setValue(reportRepository.countReviewInMonth(month, year));

            list.add(item);
        }

        return list;
    }


    public List<SoldByCategoryItem> getSoldByCategory() {

        List<SoldByCategoryItem> list = new ArrayList<>();
        List<Object[]> results = reportRepository.getSoldByCategory();

        for (Object[] result : results) {
            SoldByCategoryItem item = new SoldByCategoryItem();
            item.setName((String) result[0]);
            item.setTotalSold((Integer) result[1]);
            list.add(item);
        }

        return list;
    }

    public List<RevenueItem> getRevenueOfNDay(Integer n) {

        List<RevenueItem> list = new ArrayList<>();
        List<Object[]> results = reportRepository.getRevenueOfNDay(n);

        for (Object[] result : results) {
            RevenueItem item = new RevenueItem();

            item.setNgay((Date) result[0]);
            item.setTotal((Double) result[1]);
            list.add(item);
        }
        return list;
    }

    public List<RevenueYearItem> getRevenueBetweenTwoDate(Date fromDate, Date toDate) {
        List<RevenueYearItem> list = new ArrayList<>();
        List<Object[]> results = reportRepository.getRevenueBetweenTwoDate(fromDate, toDate);

        for (Object[] result : results) {
            RevenueYearItem item = new RevenueYearItem();
            SimpleDateFormat sdf = new SimpleDateFormat("MM/yyyy");

            // Format the date using the SimpleDateFormat
            String formattedDate = sdf.format((Date) result[0]);

            item.setMonth(formattedDate);
            item.setTotal((Double) result[1]);
            list.add(item);
        }
        return list;
    }

    public List<RevenueYearItem> getProfitBetweenTwoDate(Date fromDate, Date toDate) {
        List<RevenueYearItem> list = new ArrayList<>();
        List<Object[]> results = reportRepository.getProfitBetweenTwoDate(fromDate, toDate);

        for (Object[] result : results) {
            RevenueYearItem item = new RevenueYearItem();
            SimpleDateFormat sdf = new SimpleDateFormat("MM/yyyy");

            // Format the date using the SimpleDateFormat
            String formattedDate = sdf.format((Date) result[0]);

            item.setMonth(formattedDate);
            item.setTotal((Double) result[1]);
            list.add(item);
        }
        return list;
    }



    public List<RevenueYearItem> getRevenueInYear(Integer year) {

        List<RevenueYearItem> list = new ArrayList<>();
        List<Object[]> results = reportRepository.getRevenueInYear(year);

        for (Object[] result : results) {
            RevenueYearItem item = new RevenueYearItem();
            LocalDate date = LocalDate.of(year, (Integer) result[0], 1);

            // Create a formatter for "MM/yyyy" format
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");

            // Format the LocalDate using the formatter
            String formattedDate = date.format(formatter);
            item.setMonth(formattedDate);
            item.setTotal((Double) result[1]);
            list.add(item);
        }
        return list;
    }




    public Date subDays(Date date, int days) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.add(Calendar.DATE, -days);
        return cal.getTime();
    }

    private String convertDayToString(Date date) {
        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
        return df.format(date);
    }

    public static String capitalizeFirstLetter(String str) {
        if(str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
