package com.smartlearning.platform.security; // Make sure this package matches

import com.smartlearning.platform.model.User; // Import your User entity
import com.smartlearning.platform.repository.UserRepository; // Import your UserRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Spring Security's UserDetailsService interface
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // For transactional method

// This service loads user-specific data during authentication
@Service // Marks this as a Spring Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository; // Inject UserRepository to fetch user from DB

    @Override
    @Transactional // Ensures the database operation is transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        // Build UserDetailsImpl from the User entity
        return UserDetailsImpl.build(user);
    }
}
