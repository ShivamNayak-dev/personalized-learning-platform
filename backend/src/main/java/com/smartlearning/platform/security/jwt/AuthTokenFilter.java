package com.smartlearning.platform.security.jwt;

import com.smartlearning.platform.security.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            logger.info("AuthTokenFilter: Entering doFilterInternal for request: {}", request.getRequestURI()); // ADD THIS LINE
            String jwt = parseJwt(request);
            logger.info("AuthTokenFilter: Parsed JWT: {}", (jwt != null ? "Token found" : "No token")); // ADD THIS LINE

            if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
                logger.info("AuthTokenFilter: JWT is valid. Attempting to get username."); // ADD THIS LINE
                String username = jwtUtil.getUserNameFromJwtToken(jwt);
                logger.info("AuthTokenFilter: Username from JWT: {}", username); // ADD THIS LINE

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                logger.info("AuthTokenFilter: UserDetails loaded for username: {}", userDetails.getUsername()); // ADD THIS LINE

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("AuthTokenFilter: Authentication set in SecurityContext for user: {}", username); // ADD THIS LINE
            } else {
                logger.info("AuthTokenFilter: JWT is null or invalid. Proceeding without setting authentication."); // ADD THIS LINE
            }
        } catch (Exception e) {
            logger.error("AuthTokenFilter: Cannot set user authentication: {}", e.getMessage(), e); // MODIFIED: Added 'e' to log full stack trace
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        logger.info("AuthTokenFilter: Authorization Header: {}", headerAuth); // ADD THIS LINE

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}