package com.quizapp.config;

import com.quizapp.model.Administrateur;
import com.quizapp.model.Role;
import com.quizapp.model.enums.RoleEnum;
import com.quizapp.repository.RoleRepository;
import com.quizapp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Hibernate ddl-auto=update does not refresh PostgreSQL enum check constraints.
        jdbcTemplate.execute("ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check");
        jdbcTemplate.execute("ALTER TABLE questions ADD CONSTRAINT questions_type_check CHECK (type IN ('QCM','CHOIX_UNIQUE','CHOIX_MULTIPLE','VRAI_FAUX','TEXTE_LIBRE'))");
        // Seed roles
        Arrays.stream(RoleEnum.values()).forEach(roleEnum -> {
            if (roleRepository.findByNom(roleEnum).isEmpty()) {
                Role role = new Role();
                role.setNom(roleEnum);
                roleRepository.save(role);
            }
        });

        // Seed default admin
        if (!utilisateurRepository.existsByEmail("admin@quizapp.com")) {
            Role adminRole = roleRepository.findByNom(RoleEnum.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Role ADMIN non trouvé"));

            Administrateur admin = new Administrateur();
            admin.setNom("Admin");
            admin.setPrenom("Système");
            admin.setEmail("admin@quizapp.com");
            admin.setMotDePasse(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            admin.setActif(true);
            admin.setDepartement("IT");
            
            utilisateurRepository.save(admin);
        }
    }
}
