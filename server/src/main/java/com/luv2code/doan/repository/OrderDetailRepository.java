package com.luv2code.doan.repository;

import com.luv2code.doan.bean.OrderDetailKey;
import com.luv2code.doan.entity.OrderDetail;
import com.luv2code.doan.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailKey> {
    @Query("SELECT os FROM OrderDetail os where  os.order.id = :id")
    public List<OrderDetail> getListOrderDetailByOrder(int id);
}
