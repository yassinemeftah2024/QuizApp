package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Administrateur — sous-classe de Utilisateur (héritage JOINED).
 * Accès complet à la plateforme : gestion utilisateurs, stats globales.
 */
@Entity
@Table(name = "administrateurs")
@DiscriminatorValue("ADMIN")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Administrateur extends Utilisateur {

    @Column(length = 100)
    private String departement;
}
