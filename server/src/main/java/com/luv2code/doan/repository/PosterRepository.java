package com.luv2code.doan.repository;

import com.luv2code.doan.entity.Category;
import com.luv2code.doan.entity.Poster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PosterRepository extends JpaRepository<Poster, String> {
    @Query("SELECT p FROM Poster p WHERE p.type = 0")
    public List<Poster> listPosterRight();

    @Query("SELECT p FROM Poster p WHERE p.type = 0 AND p.isActive <> FALSE")
    public List<Poster> listPosterRightUser();

    @Query("SELECT p FROM Poster p WHERE p.type = 1")
    public List<Poster> listPosterLeft();

    @Query("SELECT p FROM Poster p WHERE p.type = 1 AND p.isActive <> FALSE")
    public List<Poster> listPosterLeftUser();

    @Query("SELECT p FROM Poster p WHERE p.type = :type AND p.id = :id")
    public Poster getPosterByIdAndType(Integer id, String type);

    @Query("SELECT COUNT(p.id) from Poster p WHERE p.id = :id")
    public Long countById(String id);

    @Query("SELECT p FROM Poster p WHERE p.isActive <> FALSE")
    public List<Poster> getListPosters();

    @Query("SELECT c FROM Poster c WHERE (c.name LIKE %:keyword%)")
    public Page<Poster> getListPostersAdminWithKeyword(String keyword, Pageable pageable);

    @Query("SELECT c FROM Poster c")
    public Page<Poster> getListPostersAdmin( Pageable pageable);

    public boolean existsById(String id);

    public boolean existsByName(String name);
}
