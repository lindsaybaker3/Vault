package org.example.security;

// imports

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.example.security.JwtConverter;
import org.springframework.web.bind.annotation.GetMapping;

@Configuration
public class SecurityConfig {

    private final JwtConverter converter;

    public SecurityConfig(JwtConverter converter) {
        this.converter = converter;
    }

    // new... add the parameter: `AuthenticationConfiguration authConfig`
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationConfiguration authConfig) throws Exception {

        http.csrf().disable();

        http.cors();


        http.authorizeRequests()
                .antMatchers("/authenticate").permitAll()
                .antMatchers("/signup").permitAll()

                .antMatchers(HttpMethod.GET, "/api/vault/transactions").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.GET, "/api/vault/transaction/*").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.GET, "/api/vault/transaction/goals/*").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.POST, "/api/vault/transaction/create").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/vault/transaction/*").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/vault/transaction/*").hasAnyAuthority("USER", "ADMIN")


                .antMatchers(HttpMethod.GET, "/api/vault/goals").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.GET, "/api/vault/goals/*").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.POST, "/api/vault/goal/create").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/vault/goal/*").hasAnyAuthority("USER", "ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/vault/goal/*").hasAnyAuthority("USER", "ADMIN")

                .antMatchers("/**").denyAll()
                .and()
                // New...
                .addFilter(new JwtRequestFilter(authenticationManager(authConfig), converter))
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
