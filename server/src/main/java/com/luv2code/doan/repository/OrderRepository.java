package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Category;
import com.luv2code.doan.entity.Order;
import com.luv2code.doan.entity.OrderDetail;
import com.luv2code.doan.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderDetails od JOIN od.product p "
            + "WHERE o.customer.id = :userId AND p.name LIKE %:keyword% AND " +
            "o.date >= case when :startDate IS NULL THEN (SELECT MIN(o.date) FROM Order  o) else :startDate end " +
            "AND o.date <= case when :endDate IS NULL THEN (SELECT MAX(o.date) FROM Order  o) else :endDate end AND " +
            "(( :status = 'ALL' AND o.status <> '') OR (:status <> 'ALL' AND o.status = :status))")
    public Page<Order> findByKeyword(String keyword, Integer userId, Date startDate, Date endDate, String status, Pageable pageable);


    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND " +
            "o.date >= case when :startDate IS NULL THEN (SELECT MIN(o.date) FROM Order  o) else :startDate end " +
            "AND o.date <= case when :endDate IS NULL THEN (SELECT MAX(o.date) FROM Order  o) else :endDate end AND " +
            "((:status = 'ALL' AND o.status <> '') OR (:status <> 'ALL' AND o.status = :status))")
    public Page<Order> findAll(Integer userId, Date startDate, Date endDate, String status, Pageable pageable);


    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderDetails od JOIN od.product p "
            + "WHERE p.name LIKE %:keyword% AND " +
            "o.date >= case when :startDate IS NULL THEN (SELECT MIN(o.date) FROM Order  o) else :startDate end " +
            "AND o.date <= case when :endDate IS NULL THEN (SELECT MAX(o.date) FROM Order  o) else :endDate end AND " +
            "(( :status = 'ALL' AND o.status <> '') OR (:status <> 'ALL' AND o.status = :status))")
    public Page<Order> findAdminByKeyword(String keyword, Date startDate, Date endDate, String status, Pageable pageable);


    @Query("SELECT o FROM Order o WHERE " +
            "o.date >= case when :startDate IS NULL THEN (SELECT MIN(o.date) FROM Order  o) else :startDate end " +
            "AND o.date <= case when :endDate IS NULL THEN (SELECT MAX(o.date) FROM Order  o) else :endDate end AND " +
            "((:status = 'ALL' AND o.status <> '') OR (:status <> 'ALL' AND o.status = :status))")
    public Page<Order> findAdminAll(Date startDate, Date endDate, String status, Pageable pageable);


    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND o.id = :id")
    public Order findByIdAndUser(Integer id, Integer userId);

    @Query("SELECT o FROM Order o WHERE o.id = :id")
    public Order findByOrderId(Integer id);

    public Order findOrderByPaymentId(String paymentId);

    @Query("Select o from OrderDetail o WHERE  o.order.id = :id")
    public List<OrderDetail> getOrderDetail(Integer id);

    @Query(value = "select count(*) from (Select id, status_id From orders where user_id = :userId) AS ref inner join order_detail AS od\n" +
            "on ref.id = od.order_id and od.product_id = :productId and ref.status_id = 4", nativeQuery = true)
    public long countOrderByProductAndUser(Integer userId, Integer productId);

    // User order query
    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId")
    public Page<Order> findOrderByUser(Integer userId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND (o.name LIKE %:keyword% OR o.phone LIKE %:keyword%)")
    public Page<Order> findOrderByUserWithKeyword(Integer userId, String keyword, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND o.date >= :fromDate AND o.date <= :toDate")
    public Page<Order> findOrderByUserBetweenDate(Integer userId,Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND o.date >= :fromDate AND o.date <= :toDate AND (o.name LIKE %:keyword% OR o.phone LIKE %:keyword%)")
    public Page<Order> findOrderByUserBetweenDateWithKeyword(Integer userId,Date fromDate, Date toDate, String keyword, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND o.status.id = :orderStatusId")
    public Page<Order> getOrderByUserAndStatus(Integer userId, Integer orderStatusId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.customer.id = :userId AND o.status.id = :orderStatusId AND o.date >= :fromDate AND o.date <= :toDate")
    public Page<Order> getOrderByUserAndStatusBetweenDate(Integer userId, Integer orderStatusId, Date fromDate, Date toDate, Pageable pageable);


    // Admin order query
    @Query("SELECT c FROM Order c WHERE (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%)")
    public Page<Order> getListOrdersAdminWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%) AND c.status.id in :listStatusIds")
    public Page<Order> getListOrdersAdminWithKeywordAndStatusId(String keyword, List<Integer> listStatusIds, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.status.id in :listStatusIds")
    public Page<Order> getListOrdersAdminWithStatusId( List<Integer> listStatusIds, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%) AND c.status.id in :listStatusIds")
    public Page<Order> getListOrdersAdminWithKeywordBetweenDateAndStatusId( String keyword, List<Integer> listStatusIds,Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND c.status.id in :listStatusIds")
    public Page<Order> getListOrdersAdminBetweenDateAndStatusId(List<Integer> listStatusIds,Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%)")
    public Page<Order> getListOrdersAdminWithKeywordBetweenDate(String keyword, Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate")
    public Page<Order> getListOrdersAdminBetweenDate(Date fromDate, Date toDate, Pageable pageable);


    // Shipper order query
    @Query("SELECT c FROM Order c WHERE (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%) AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperWithKeyword(String staffId, String keyword, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%) AND c.status.id in :listStatusIds AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperWithKeywordAndStatusId(String staffId,String keyword, List<Integer> listStatusIds, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.status.id in :listStatusIds AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperWithStatusId(String staffId, List<Integer> listStatusIds, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%) AND c.status.id in :listStatusIds AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperWithKeywordBetweenDateAndStatusId(String staffId, String keyword, List<Integer> listStatusIds,Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND c.status.id in :listStatusIds AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperBetweenDateAndStatusId(String staffId,List<Integer> listStatusIds,Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND (c.name LIKE %:keyword% OR c.phone LIKE %:keyword%) AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperWithKeywordBetweenDate(String staffId,String keyword, Date fromDate, Date toDate, Pageable pageable);

    @Query("SELECT c FROM Order c WHERE c.date >= :fromDate AND c.date <= :toDate AND c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipperBetweenDate(String staffId,Date fromDate, Date toDate, Pageable pageable);

    // Get all order admin query
    @Query("SELECT c FROM Order c WHERE c.staffDelivery.id = :staffId")
    public Page<Order> getListOrdersShipper(String staffId, Pageable pageable);

    // Get all order admin query
    @Query("SELECT c FROM Order c")
    public Page<Order> getListOrdersAdmin( Pageable pageable);


}
