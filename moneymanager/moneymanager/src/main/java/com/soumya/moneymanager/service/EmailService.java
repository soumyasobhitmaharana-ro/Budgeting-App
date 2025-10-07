package com.soumya.moneymanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final JavaMailSender mailSender;

  @Value("${spring.mail.properties.mail.smtp.from}")
  private String fromEmail;

  public void sendEmail(String to, String subject, String body) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true → enable HTML content

        mailSender.send(message);
        // log.info("Email sent successfully to {}", to);

    } catch (Exception e) {
        // log.error("Failed to send email to {}", to, e);
        throw new RuntimeException("Failed to send email: " + e.getMessage());
    }
}

  public void sendEmailWithAttachment(String to, String subject, String body, String filename, byte[] attachment) {
	    try {
	        MimeMessage message = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	        helper.setFrom(fromEmail);
	        helper.setTo(to);
	        helper.setSubject(subject);
	        helper.setText(body, true);

	        helper.addAttachment(filename, () -> new java.io.ByteArrayInputStream(attachment));

	        mailSender.send(message);

	    } catch (Exception e) {
	        throw new RuntimeException("Failed to send email with attachment: " + e.getMessage());
	    }
	}


  
}
