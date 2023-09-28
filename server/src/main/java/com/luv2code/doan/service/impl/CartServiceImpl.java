package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Cart;
import com.luv2code.doan.entity.Customer;
import com.luv2code.doan.entity.Product;
import com.luv2code.doan.exceptions.CartMoreThanProductInStock;
import com.luv2code.doan.exceptions.NotFoundException;
import com.luv2code.doan.repository.CartRepository;
import com.luv2code.doan.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);

    public Cart addProductToCart(Product product, Customer user, Integer quantity) throws CartMoreThanProductInStock {
        Cart cartItem = cartRepository.findByUserIdAndProductId(user.getId(), product.getId());
        if(cartItem != null) {
            if((quantity + cartItem.getQuantity()) > product.getInStock()) {
                throw new CartMoreThanProductInStock("Số lượng yêu cầu vượt quá số lượng còn lại của sản phẩm " + product.getName() + "!");
            }
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        else {
            if(quantity > product.getInStock()) {
                throw new CartMoreThanProductInStock("Số lượng yêu cầu vượt quá số lượng còn lại của sản phẩm " + product.getName() + "!");
            }
            cartItem = new Cart();
            cartItem.setProduct(product);
            cartItem.setCustomer(user);
            cartItem.setQuantity(quantity);
        }
        cartRepository.save(cartItem);
        return cartItem;
    }

    public Cart updateCart(Product product, Customer user, Integer quantity) throws CartMoreThanProductInStock {
        Cart cartItem = cartRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if(quantity > product.getInStock()) {
            throw new CartMoreThanProductInStock("Số lượng yêu cầu vượt quá số lượng còn lại của sản phẩm này!");
        }
        if(cartItem == null) {
            cartItem = new Cart();
            cartItem.setProduct(product);
            cartItem.setCustomer(user);
        }

        cartItem.setQuantity(quantity);


        cartRepository.save(cartItem);
        return cartItem;
    }


    public Cart findCartByUserAndProduct(Integer userId, String productId) throws NotFoundException {
        return cartRepository.findByUserIdAndProductId(userId, productId);
    }

    public List<Cart> findCartByUser(Integer id) {
        return cartRepository.findByUserId(id);
    }

    public Cart findCartById(Integer id) throws NotFoundException {
        try{
            return cartRepository.findById(id).get();
        }
        catch (NoSuchElementException ex) {
            throw new NotFoundException("Could not find any cart with ID " + id);
        }
    }
    public void deleteCartItem(Integer userId, String productId) {
        cartRepository.deleteByUserAndProduct(userId, productId);
    }

    public void deleteCartItemByUser(Integer userId, List<String> listProductIds) {
        for(String productId : listProductIds) {
            deleteCartItem(userId, productId);
        }
    }

    public void deleteCartById(Integer id)  {
        cartRepository.deleteById(id);

    }


}


