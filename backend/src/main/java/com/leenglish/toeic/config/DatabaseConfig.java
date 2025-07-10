package com.leenglish.toeic.config;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/toeic8?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true&autoReconnect=true&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull}")
    private String jdbcUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public HikariConfig hikariConfig() {
        HikariConfig config = new HikariConfig();

        System.out.println("===========================================");
        System.out.println("🔧 Configuring Database Connection for XAMPP MySQL...");
        System.out.println("📍 JDBC URL: " + jdbcUrl);
        System.out.println("👤 Username: " + username);
        System.out.println("🎯 Target: XAMPP MySQL on localhost:3306");
        System.out.println("===========================================");

        // Cấu hình cơ bản
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // Cấu hình connection pool với timeout cao hơn
        config.setMaximumPoolSize(5); // Giảm pool size để tránh quá tải
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000); // 30 seconds
        config.setIdleTimeout(600000); // 10 minutes
        config.setMaxLifetime(1800000); // 30 minutes
        config.setLeakDetectionThreshold(60000); // 1 minute

        // Cấu hình validation
        config.setConnectionTestQuery("SELECT 1");
        config.setValidationTimeout(5000);

        // Cấu hình khởi tạo
        config.setInitializationFailTimeout(30000); // Cho phép 30s để khởi tạo
        config.setAutoCommit(true);

        // Pool name for identification
        config.setPoolName("ToeicHikariPool");

        return config;
    }

    @Bean
    @Primary
    @ConditionalOnProperty(name = "spring.datasource.url")
    public DataSource dataSource() {
        try {
            HikariDataSource dataSource = new HikariDataSource(hikariConfig());

            // Test connection ngay khi tạo DataSource
            System.out.println("🔍 Testing database connection...");
            try (Connection connection = dataSource.getConnection()) {
                boolean isValid = connection.isValid(5);
                if (isValid) {
                    System.out.println("✅ Database connection successful!");
                    System.out.println("📊 Database URL: " + connection.getMetaData().getURL());
                    System.out.println("🏷️ Database: " + connection.getMetaData().getDatabaseProductName());
                } else {
                    System.out.println("❌ Database connection validation failed");
                }
            } catch (SQLException e) {
                System.out.println("⚠️ Database connection test failed: " + e.getMessage());
                System.out.println("🔧 Application will start without database connection");
                // Không throw exception để cho phép ứng dụng khởi động
            }

            return dataSource;

        } catch (Exception e) {
            System.err.println("❌ Failed to create DataSource: " + e.getMessage());
            System.err.println("🔧 Creating fallback DataSource configuration...");

            // Tạo fallback DataSource với cấu hình tối thiểu
            HikariConfig fallbackConfig = new HikariConfig();
            fallbackConfig.setJdbcUrl(jdbcUrl);
            fallbackConfig.setUsername(username);
            fallbackConfig.setPassword(password);
            fallbackConfig.setDriverClassName("com.mysql.cj.jdbc.Driver");
            fallbackConfig.setInitializationFailTimeout(-1); // Disable fail-fast
            fallbackConfig.setMaximumPoolSize(1);
            fallbackConfig.setMinimumIdle(0);

            return new HikariDataSource(fallbackConfig);
        }
    }
}
