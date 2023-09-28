package com.luv2code.doan.service.impl;

import com.luv2code.doan.entity.Product;
import com.luv2code.doan.entity.Promotion;
import com.luv2code.doan.entity.PromotionDetail;
import com.luv2code.doan.exceptions.PromotionNotFoundException;
import com.luv2code.doan.repository.PromotionDetailRepository;
import com.luv2code.doan.repository.PromotionRepository;
import com.luv2code.doan.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    @Override
    public Promotion getPromotionById(String id) throws PromotionNotFoundException {
        try {
            Promotion promotion = promotionRepository.findById(id).get();
            return promotion;

        }
        catch(NoSuchElementException ex) {
            throw new PromotionNotFoundException("Could not find any promotion with ID " + id);
        }
    }

    @Override
    public Promotion savePromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    @Override
    public Page<Promotion> getListPromotionsAdmin( int pageNo, int pageSize, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortField).ascending() : Sort.by(sortField).descending() ;
        Pageable pageable = PageRequest.of(pageNo -1, pageSize,sort);

        return promotionRepository.getListPromotionsAdmin(pageable);
    }

    @Override
    public void deletePromotion(String id) throws PromotionNotFoundException {
        try {
            Promotion promotion = promotionRepository.findById(id).get();
            promotionRepository.save(promotion);

        }
        catch(NoSuchElementException ex) {
            throw new PromotionNotFoundException("Could not find any promotion with ID " + id);
        }
    }

    @Override
    public void approvePromotion(String id) throws PromotionNotFoundException {
        try {
            Promotion promotion = promotionRepository.findById(id).get();
            promotionRepository.save(promotion);

        }
        catch(NoSuchElementException ex) {
            throw new PromotionNotFoundException("Could not find any promotion with ID " + id);
        }
    }

    public List<Promotion> findPromotion(Date startDate, Date finishDate) {
        return null;
    }

    @Override
    public int getCurrentPromotionByProduct(Product product) {
        List<Promotion> currentPromotion = promotionRepository.findByStartAtBeforeAndEndAtAfterOrderByIdDesc(new Date(), new Date());

        for(Promotion p : currentPromotion) {
            PromotionDetail promotionDetail = promotionDetailRepository.getPromotionDetailByProductAndAndPromotion(product, p);
            if(promotionDetail != null)
                return promotionDetail.getPercentage();
        }
        return 0;
    }

    @Override
    public boolean existsById(String id) {
        return promotionRepository.existsById(id);
    }


}
