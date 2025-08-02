package com.smartlearning.platform.security; // Keep your package name as is

import com.smartlearning.platform.security.jwt.AuthEntryPointJwt;
import com.smartlearning.platform.security.jwt.AuthTokenFilter;
import com.smartlearning.platform.security.UserDetailsServiceImpl; // Assuming this is the correct import for UserDetailsServiceImpl
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// New imports for CORS configuration
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.http.HttpMethod; // Import HttpMethod for specific method permissions

@Configuration
@EnableMethodSecurity // This enables @PreAuthorize annotations if you use them
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService; // Ensure this class exists in your project

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF for API
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Allow authentication endpoints (login, register)
                .requestMatchers("/api/auth/test/protected").authenticated() // Specific protected test endpoint

                // --- UPDATED RULES FOR /api/courses/** ---
                // Allow GET requests to /api/courses/** if user has ROLE_STUDENT or ROLE_ADMIN
                .requestMatchers(HttpMethod.GET, "/api/courses/**").hasAnyRole("STUDENT", "ADMIN")
                // Require ROLE_ADMIN for POST, PUT, DELETE requests to /api/courses/**
                .requestMatchers(HttpMethod.POST, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("ADMIN")
                // --- END UPDATED RULES ---

                .anyRequest().authenticated() // All other requests require authentication
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        // --- CORS CONFIGURATION ---
        http.cors(); // Enables CORS integration with Spring Security's filter chain
        // --- END CORS CONFIGURATION ---

        return http.build();
    }

    // --- NEW BEAN FOR CORS FILTER ---
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Allow sending credentials like JWT tokens
        config.addAllowedOrigin("http://localhost:5173"); // **IMPORTANT: YOUR FRONTEND URL**
        config.addAllowedHeader("*"); // Allow all headers
        config.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
        source.registerCorsConfiguration("/**", config); // Apply this CORS config to all paths
        return new CorsFilter(source);
    }
    // --- END NEW BEAN ---
}