package com.luv2code.doan.repository;

import com.luv2code.doan.bean.SaleHistoryItem;
import com.luv2code.doan.bean.SoldByCategoryItem;
import com.luv2code.doan.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface ReportRepository extends JpaRepository<Order, Integer> {



    @Query("SELECT count(u.id) FROM Customer u WHERE u.registrationDate = :date")
    public long countUserByDate(Date date);

    @Query("SELECT count(r.id) FROM Review r WHERE r.date = :date")
    public long countReviewByDate(Date date);

    // need write again
    @Query("SELECT COALESCE(sum(0),0) FROM Order o WHERE o.date = :date AND o.status.id = 4")
    public double totalEarnByDate(Date date);

    @Query("SELECT COALESCE(sum(0),0) FROM Order o WHERE o.date = :date AND o.status.id = 4 AND o.customer.id = :userId")
    public double totalBuyHistoryByDateOfUser(Date date, Integer userId);

    @Query(value = "SET DATEFIRST 1; SELECT count(*) FROM the_order WHERE DATEPART(WEEK, [created_at]) = DATEPART(WEEK, GETDATE()) and status_id = :statusId", nativeQuery = true)
    public long countOrderByWeekAndStatusId(Integer statusId);

    @Query(value = "SET DATEFIRST 1; SELECT count(*) FROM the_order WHERE MONTH([created_at]) = MONTH(GETDATE()) and status_id = :statusId", nativeQuery = true)
    public long countOrderByMonthAndStatusId(Integer statusId);

    @Query(value = "SET DATEFIRST 1; SELECT count(*) FROM the_order WHERE YEAR([created_at]) = YEAR(GETDATE()) and status_id = :statusId", nativeQuery = true)
    public long countOrderByYearAndStatusId(Integer statusId);

    @Query(value = "SELECT count(*) FROM the_order WHERE DATEPART(WEEK, [created_at]) = DATEPART(WEEK, GETDATE()) and status_id = 5 AND reason_cancel_id = :reason", nativeQuery = true)
    public long countListOrderCancelByWeekAndReason(int reason);

    @Query(value = "SELECT count(*) FROM the_order WHERE MONTH([created_at]) = MONTH(GETDATE()) and status_id = 5 AND reason_cancel_id = :reason", nativeQuery = true)
    public long countListOrderCancelByMonthAndReason(int reason);

    @Query(value = "SELECT count(*) FROM the_order WHERE YEAR([created_at]) = YEAR(GETDATE()) and status_id = 5 AND reason_cancel_id = :reason", nativeQuery = true)
    public long countListOrderCancelByYearAndReason(int reason);


    @Query(value = "SELECT count(*) FROM the_order WHERE DATEPART(WEEK, [created_at]) = DATEPART(WEEK, GETDATE())", nativeQuery = true)
    public long countOrderByWeek();

    @Query(value = "SELECT count(*) FROM the_order WHERE MONTH([created_at]) = MONTH(GETDATE())", nativeQuery = true)
    public long countOrderByMonth();

    @Query(value = "SELECT count(*) FROM the_order WHERE YEAR([created_at]) = YEAR(GETDATE())", nativeQuery = true)
    public long countOrderByYear();

    @Query(value = "CALL sp_get_total_revenue_month(:month, :year );", nativeQuery = true)
    public double getTotalRevenueInMonth(int month, int year);

    @Query(value = "CALL sp_count_user_month(:month, :year );", nativeQuery = true)
    public long countUserInMonth(int month, int year);

    @Query(value = "CALL sp_count_review_month(:month, :year );", nativeQuery = true)
    public long countReviewInMonth(int month, int year);

    @Query(value = "CALL sp_get_total_order_month();", nativeQuery = true)
    public long getTotalOrderInMonth();

    @Query(value = "CALL sp_get_total_user_month();", nativeQuery = true)
    public long getTotalUserInMonth();

    @Query(value = "CALL sp_get_total_review_month();", nativeQuery = true)
    public long getTotalReviewInMonth();

    @Query(value = "CALL sp_get_total_revenue_user(:month, :year, :userId );", nativeQuery = true)
    public double getTotalReviewInMonthOfUser(int month, int year, int userId);

    @Query(value = "EXEC SOLD_BY_CATEGORY", nativeQuery = true)
    public List<Object[]> getSoldByCategory();

    @Query(value = "EXEC BAO_CAO_DOANH_THU_N_NGAY_GAN_NHAT :n", nativeQuery = true)
    public List<Object[]> getRevenueOfNDay(Integer n);

    @Query(value = "EXEC BAO_CAO_DOANH_THU_THEO_NAM :n", nativeQuery = true)
    public List<Object[]> getRevenueInYear(Integer n);

    @Query(value = "EXEC BAO_CAO_DOANH_THU_THEO_KHOANG :fromDate,:toDate", nativeQuery = true)
    public List<Object[]> getRevenueBetweenTwoDate(Date fromDate, Date toDate);

    @Query(value = "EXEC BAO_CAO_LOI_NHUAN_THEO_KHOANG :fromDate,:toDate", nativeQuery = true)
    public List<Object[]> getProfitBetweenTwoDate(Date fromDate, Date toDate);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.registrationDate >= :date30DaysAgo")
    long countUsersRegisteredWithin30Days(Date date30DaysAgo);

    @Query("SELECT COUNT(c) FROM Order c WHERE c.date >= :date30DaysAgo")
    long countOrderCreatedWithin30Days(Date date30DaysAgo);

    @Query("SELECT COUNT(c) FROM Review c WHERE c.date >= :date30DaysAgo")
    long countReviewCreatedWithin30Days(Date date30DaysAgo);
}
