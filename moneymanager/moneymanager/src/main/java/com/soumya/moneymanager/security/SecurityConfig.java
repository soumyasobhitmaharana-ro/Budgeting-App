package com.soumya.moneymanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.soumya.moneymanager.service.AppUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  private final AppUserDetailsService userDetailsService;

  private final JwtRequestFilter jwtRequestFilter;

  private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfig.class);

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http.csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint()))
        .authorizeHttpRequests(auth -> auth
            // Public auth endpoints
            .requestMatchers("/api/v1.0/auth/**").permitAll()
            // Preflight CORS
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            // Savings Goals must be authenticated
            .requestMatchers("/api/v1.0/goals/**").authenticated()
            // Existing public endpoints (keep current behavior)
            .requestMatchers("/login", "/status", "/register", "/activate", "/health","/forgot-password","/reset-password", "/refresh-token", "/error").permitAll()
            .anyRequest().authenticated())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // Ensure JWT filter runs before username/password filter
        .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    http.cors(Customizer.withDefaults());

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public CorsConfigurationSource configurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationManager authenticationManager() {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(userDetailsService);
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return new ProviderManager(daoAuthenticationProvider);
  }

  @Bean
  public AuthenticationEntryPoint authenticationEntryPoint() {
    return new AuthenticationEntryPoint() {
      @Override
      public void commence(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) throws IOException, ServletException {
        LOGGER.warn("JWT auth failure on {} {} -> {}", request.getMethod(), request.getRequestURI(), authException.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
      }
    };
  }

}
