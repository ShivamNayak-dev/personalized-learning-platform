package com.smartlearning.platform.security; // Make sure this package matches

import com.fasterxml.jackson.annotation.JsonIgnore; // To ignore password in JSON serialization
import com.smartlearning.platform.model.User; // Import your User entity
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // Spring Security's UserDetails interface

import java.util.Collection;
import java.util.Collections; // For simple role handling
import java.util.Objects; // For equals and hashCode

// This class implements Spring Security's UserDetails interface,
// representing our User entity for authentication purposes.
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String username;

    @JsonIgnore // Prevents password from being exposed in JSON responses
    private String password;

    private Collection<? extends GrantedAuthority> authorities; // User's roles/authorities

    // Constructor to create UserDetailsImpl from your User entity
    public UserDetailsImpl(Long id, String username, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    // Static method to build UserDetailsImpl from your User entity
    public static UserDetailsImpl build(User user) {
        // For simplicity, we'll map a single role string to a SimpleGrantedAuthority
        // For multiple roles, you would iterate and add them to a list.
        // --- THIS IS THE CRUCIAL CHANGE ---
        // Ensure the role is prefixed with "ROLE_"
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());
        // --- END OF CRUCIAL CHANGE ---

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority) // Creates an immutable list with a single element
        );
    }

    // --- UserDetails Interface Implementations ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // For now, accounts never expire
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // For now, accounts are never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // For now, credentials never expire
    }

    @Override
    public boolean isEnabled() {
        return true; // For now, accounts are always enabled
    }

    // Optional: Override equals and hashCode for proper collection handling
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}