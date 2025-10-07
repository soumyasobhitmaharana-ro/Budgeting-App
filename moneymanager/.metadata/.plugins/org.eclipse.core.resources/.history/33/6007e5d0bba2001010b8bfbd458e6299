package com.suraj.moneymanager.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.suraj.moneymanager.dto.ExpenseDTO;
import com.suraj.moneymanager.entity.ProfileEntity;
import com.suraj.moneymanager.repository.ProfileRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

  private final ExpenseService expenseService;
  private final IncomeService incomeService;
  private final ProfileService profileService;
  private final ProfileRepo profileRepo;
  private final EmailService emailService;

  @Value("${money.manager.frontend.url}")
  private String frontendUrl;

  // @Scheduled(cron= "0 * * * * *",zone="IST")

  @Scheduled(cron = "0 0 22 * * *", zone = "IST")
  public void sendDailyIncomeExpenseRemainder() {
    log.info("Job started: sendDailyIncomeExpenseRemainder");

    List<ProfileEntity> profiles = profileRepo.findAll();

    for (ProfileEntity profile : profiles) {
      String body = "<!DOCTYPE html>"
          + "<html>"
          + "<head>"
          + "<meta charset='UTF-8'>"
          + "<style>"
          + "body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }"
          + ".container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; "
          + "box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 10px; }"
          + "h2 { color: #333333; }"
          + "p { font-size: 16px; color: #555555; line-height: 1.5; }"
          + ".button { display: inline-block; background-color: #4CAF50; color: white; "
          + "padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; }"
          + ".footer { margin-top: 20px; font-size: 13px; color: #888888; text-align: center; }"
          + "</style>"
          + "</head>"
          + "<body>"
          + "<div class='container'>"
          + "<h2>Hi " + profile.getFullName() + ",</h2>"
          + "<p>This is a friendly reminder for your <b>daily expense and income</b>. "
          + "You can check the detailed summary in your Money Manager Dashboard.</p>"
          + "<p style='text-align: center;'>"
          + "<a href='" + frontendUrl + "' class='button'>View Dashboard</a>"
          + "</p>"
          + "<p>Stay on top of your finances 🚀</p>"
          + "<div class='footer'>"
          + "<p>Thanks,<br>Money Manager Team</p>"
          + "</div>"
          + "</div>"
          + "</body>"
          + "</html>";

      emailService.sendEmail(profile.getEmail(),
          "Daily Expense and Income Reminder",
          body);
    }
    log.info("Job completed: sendDailyIncomeExpenseRemainder");
  }

   @Scheduled(cron = "0 0 23 * * *", zone = "IST")
  public void sendDailyExpenseSummary() {
    log.info("Job started: sendDailyExpenseSummary");

    List<ProfileEntity> profiles = profileRepo.findAll();
    for (ProfileEntity profile : profiles) {
        List<ExpenseDTO> todayExpense = expenseService.getExpenseForUserOnDate(profile.getId(), LocalDate.now());

        if (!todayExpense.isEmpty()) {
            // Build table with Serial No and colorful rows
            StringBuilder table = new StringBuilder();
            table.append("<table style='width:100%; border-collapse:collapse; margin-top:20px;'>")
                 .append("<tr style='background-color:#4CAF50; color:white;'>")
                 .append("<th style='padding:8px; border:1px solid #ddd;'>S.No</th>")
                 .append("<th style='padding:8px; border:1px solid #ddd;'>Name</th>")
                 .append("<th style='padding:8px; border:1px solid #ddd;'>Amount</th>")
                 .append("<th style='padding:8px; border:1px solid #ddd;'>Category</th>")
                 .append("</tr>");

            int serial = 1;
            for (ExpenseDTO expense : todayExpense) {
                String bgColor = (serial % 2 == 0) ? "#f2f2f2" : "#ffffff"; // alternate row color
                table.append("<tr style='background-color:" + bgColor + ";'>")
                     .append("<td style='padding:8px; border:1px solid #ddd; text-align:center;'>").append(serial).append("</td>")
                     .append("<td style='padding:8px; border:1px solid #ddd;'>")
                     .append(expense.getName() != null ? expense.getName() : "N/A")
                     .append("</td>")
                     .append("<td style='padding:8px; border:1px solid #ddd; text-align:right;'>")
                     .append(expense.getAmount() != null ? expense.getAmount() : "N/A")
                     .append("</td>")
                     .append("<td style='padding:8px; border:1px solid #ddd; text-align:right;'>")
                     .append(expense.getCategoryName() != null ? expense.getCategoryName() : "N/A")
                     .append("</td>")
                     .append("</tr>");
                serial++;
            }
            table.append("</table>");

            // Build email body
            String body = "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset='UTF-8'></head>"
                + "<body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding:20px;'>"
                + "<div style='max-width:600px; margin:0 auto; background:#ffffff; padding:20px; "
                + "box-shadow:0 2px 8px rgba(0,0,0,0.1); border-radius:10px;'>"
                + "<h2 style='color:#333;'>Hi " + profile.getFullName() + ",</h2>"
                + "<p style='font-size:15px; color:#555;'>Here is your <b>daily expense summary</b> for today:</p>"
                + table.toString()
                + "<p style='text-align:center; margin:20px 0;'>"
                + "<a href='" + frontendUrl + "' style='background:#4CAF50; color:white; padding:12px 25px; "
                + "text-decoration:none; font-size:15px; border-radius:5px;'>View Dashboard</a>"
                + "</p>"
                + "<p style='color:#777; font-size:13px;'>Stay on top of your finances 🚀</p>"
                + "<div style='margin-top:20px; font-size:12px; color:#888; text-align:center;'>"
                + "Thanks,<br>Money Manager Team"
                + "</div>"
                + "</div>"
                + "</body></html>";

            // Send email
            emailService.sendEmail(profile.getEmail(),
                    "Daily Expense Summary",
                    body);
        }
    }
    log.info("Job completed: sendDailyExpenseSummary");
}


    
  


}
