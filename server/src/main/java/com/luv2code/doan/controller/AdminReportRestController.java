package com.luv2code.doan.controller;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import com.luv2code.doan.bean.*;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.exceptions.OrderStatusNotFoundException;
import com.luv2code.doan.response.*;
import com.luv2code.doan.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

import static com.luv2code.doan.controller.AdminOrderRestController.setToMidnight;
import static com.luv2code.doan.controller.OrderRestController.setToLastMinute;

@RestController
@RequestMapping("/api/admin/report")
@RequiredArgsConstructor
@Slf4j
public class AdminReportRestController {
    @Autowired
    private ReportService reportService;

    @RequestMapping(value = "/analytics", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getAnalyticsInMonth(HttpServletRequest request) {

        Double revenueInMonth =  reportService.getTotalRevenueInMonth();
        Long totalUserInMonth = reportService.getTotalUserInMonth();
        Long totalOrderInMonth = reportService.getTotalOrderInMonth();
        Long totalReviewInMonth = reportService.getTotalReviewInMonth();


        AnalyticsResponse result = new AnalyticsResponse(1, "Get analytics successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                revenueInMonth, totalUserInMonth, totalReviewInMonth, totalOrderInMonth
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/revenue", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getRevenue(@RequestParam(value = "type", required = false) Optional<Integer> pType, HttpServletRequest request) {
        int type = 0; // Type = 0 is Year, 1 is Month, 2 is Week

        if (pType.isPresent()) {
            if(pType.get() == 0 || pType.get() == 1 || pType.get() == 2) {
                type = pType.get();
            }
        }
        List<Double> data = new ArrayList<>();
        List<String> label = new ArrayList<>();

        switch (type) {
            case 0: {
                LocalDate currentDate = LocalDate.now();


                List<RevenueYearItem> list = reportService.getRevenueInYear(currentDate.getYear());
                for (RevenueYearItem item : list) {
                    data.add(item.getTotal());
                    label.add(item.getMonth());
                }
                break;
            }
            case 1: {
                List<RevenueItem> list = reportService.getRevenueOfNDay(30);
                for (RevenueItem item : list) {
                    data.add(item.getTotal());

                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

                    // Format the date using the SimpleDateFormat
                    String formattedDate = sdf.format(item.getNgay());
                    label.add(formattedDate);
                }
                break;

            }
            case 2: {
                List<RevenueItem> list = reportService.getRevenueOfNDay(7);
                for (RevenueItem item : list) {
                    data.add(item.getTotal());

                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

                    // Format the date using the SimpleDateFormat
                    String formattedDate = sdf.format(item.getNgay());
                    label.add(formattedDate);
                }
                break;
            }
        }


        RevenueResponse result = new RevenueResponse(1, "Get revenue successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                data, label
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/revenue/between", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getRevenueBetween(@RequestParam(value = "fromDate", required = true) String pFromDate,
                                     @RequestParam(value = "toDate", required = true) String pToDate, HttpServletRequest request) throws NotFoundException, IOException {
        Date fromDate = null;
        Date toDate = null;

        List<Double> data = new ArrayList<>();
        List<String> label = new ArrayList<>();
        if(!pFromDate.trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                fromDate = setToMidnight(format.parse(pFromDate));

            } catch (ParseException e) {
                e.printStackTrace();
                throw new NotFoundException("Lỗi định dạng datetime!");
            }
        }
        if(!pToDate.trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                toDate = setToLastMinute(format.parse(pToDate));
            } catch (ParseException e) {
                throw new NotFoundException("Lỗi định dạng datetime!");
            }
        }

        List<RevenueYearItem> list = reportService.getRevenueBetweenTwoDate(fromDate, toDate);

        RevenueReportResponse result = new RevenueReportResponse(1, "Get revenue successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                list
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/profit/between", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> getProfitBetween(@RequestParam(value = "fromDate", required = true) String pFromDate,
                                                @RequestParam(value = "toDate", required = true) String pToDate, HttpServletRequest request) throws NotFoundException, IOException {
        Date fromDate = null;
        Date toDate = null;

        List<Double> data = new ArrayList<>();
        List<String> label = new ArrayList<>();
        if(!pFromDate.trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                fromDate = setToMidnight(format.parse(pFromDate));

            } catch (ParseException e) {
                e.printStackTrace();
                throw new NotFoundException("Lỗi định dạng datetime!");
            }
        }
        if(!pToDate.trim().isEmpty()) {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
            try {
                toDate = setToLastMinute(format.parse(pToDate));
            } catch (ParseException e) {
                throw new NotFoundException("Lỗi định dạng datetime!");
            }
        }

        List<RevenueYearItem> list = reportService.getProfitBetweenTwoDate(fromDate, toDate);

        RevenueReportResponse result = new RevenueReportResponse(1, "Get profit successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                list
        );

        return new ResponseEntity(result, HttpStatus.OK);
    }


    @RequestMapping(value = "/order", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> orderOverview(@RequestParam(value = "type", required = false) Optional<Integer> pType, HttpServletRequest request) throws OrderStatusNotFoundException {

        int type = 0; // Type = 0 is Year, 1 is Month, 2 is Week

        if (pType.isPresent()) {
            if(pType.get() == 0 || pType.get() == 1 || pType.get() == 2) {
                type = pType.get();
            }
        }

        List<ReportItem> list =  reportService.reportOrder(type);


        List<Long> data = new ArrayList<>();
        List<String> label = new ArrayList<>();

        for (ReportItem item : list) {
            data.add(item.getValue());
            label.add(item.getName());
        }

        ReportResponse result = new ReportResponse(1, "Get order overview successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                data, label
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> userOverview(@RequestParam(value = "type", required = false) Optional<Integer> pType, HttpServletRequest request) throws OrderStatusNotFoundException {

        int type = 0; // Type = 0 is Year, 1 is Month, 2 is Week

        if (pType.isPresent()) {
            if(pType.get() == 0 || pType.get() == 1 || pType.get() == 2) {
                type = pType.get();
            }
        }


        List<ReportItem> list = new ArrayList<>();

        switch (type) {
            case 0: {
                list = reportService.getOverviewUserByYear();
                break;
            }
            case 1: {
                list = reportService.getOverviewUserByMonth();
                break;

            }
            case 2: {
                list = reportService.getOverviewUserByWeek();
                break;
            }
        }

        List<Long> data = new ArrayList<>();
        List<String> label = new ArrayList<>();

        for (ReportItem item : list) {
            data.add(item.getValue());
            label.add(item.getName());
        }

        ReportResponse result = new ReportResponse(1, "Get user overview successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                data, label
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/review", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> reviewOverview(@RequestParam(value = "type", required = false) Optional<Integer> pType, HttpServletRequest request) throws OrderStatusNotFoundException {

        int type = 0; // Type = 0 is Year, 1 is Month, 2 is Week

        if (pType.isPresent()) {
            if(pType.get() == 0 || pType.get() == 1 || pType.get() == 2) {
                type = pType.get();
            }
        }


        List<ReportItem> list = new ArrayList<>();

        switch (type) {
            case 0: {
                list = reportService.getOverviewReviewByYear();
                break;
            }
            case 1: {
                list = reportService.getOverviewReviewByMonth();
                break;

            }
            case 2: {
                list = reportService.getOverviewReviewByWeek();
                break;
            }
        }

        List<Long> data = new ArrayList<>();
        List<String> label = new ArrayList<>();

        for (ReportItem item : list) {
            data.add(item.getValue());
            label.add(item.getName());
        }

        ReportResponse result = new ReportResponse(1, "Get review overview successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                data, label
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/category", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> soldByCategory(HttpServletRequest request) {
        List<SoldByCategoryItem> list = reportService.getSoldByCategory();


        List<Integer> data = new ArrayList<>();
        List<String> label = new ArrayList<>();

        for (SoldByCategoryItem item : list) {
            data.add(item.getTotalSold());
            label.add(item.getName());
        }

        SaleCategoryResponse result = new SaleCategoryResponse(1, "Get sold by category successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                data, label
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/order-cancel", method = RequestMethod.GET)
    @ResponseBody
    private ResponseEntity<?> orderCancelOverview(@RequestParam(value = "type", required = false) Optional<Integer> pType, HttpServletRequest request) throws OrderStatusNotFoundException {

        int type = 0; // Type = 0 is Year, 1 is Month, 2 is Week

        if (pType.isPresent()) {
            if(pType.get() == 0 || pType.get() == 1 || pType.get() == 2) {
                type = pType.get();
            }
        }

        List<ReportItem> list =  reportService.reportOrderCancel(type);


        List<Long> data = new ArrayList<>();
        List<String> label = new ArrayList<>();

        for (ReportItem item : list) {
            data.add(item.getValue());
            label.add(item.getName());
        }


        long totalOrder = 0;
        long totalOrderCancel = 0;
        switch (type){
            case 0: { // year
                totalOrderCancel = reportService.countOrderByYearAndStatusId(5);
                totalOrder = reportService.countOrderByYear();
                break;
            }
            case 1: { //month
                totalOrderCancel = reportService.countOrderByMonthAndStatusId(5);
                totalOrder = reportService.countOrderByMonth();
                break;
            }
            case 2: { //week
                totalOrderCancel = reportService.countOrderByWeekAndStatusId(5);
                totalOrder = reportService.countOrderByWeek();
                break;
            }
        }

        OrderCancelReportResponse result = new OrderCancelReportResponse(1, "Get order cancel overview successfully!",
                request.getMethod(), new Date().getTime(), HttpStatus.OK.getReasonPhrase(), HttpStatus.OK.value(),
                data, label, totalOrder, totalOrderCancel
        );
        return new ResponseEntity(result, HttpStatus.OK);
    }




}
