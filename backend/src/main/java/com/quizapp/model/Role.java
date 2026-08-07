package com.quizapp.model;

import com.quizapp.model.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entité Role — table des rôles utilisateurs.
 * Utilisée pour le RBAC (Role-Based Access Control).
 */
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private RoleEnum nom;
}
