package com.soumya.moneymanager.service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;

import com.soumya.moneymanager.dto.ExpenseDTO;
import com.soumya.moneymanager.dto.IncomeDTO;
import com.soumya.moneymanager.entity.ExpenseEntity;
import com.soumya.moneymanager.entity.IncomeEntity;
import com.soumya.moneymanager.repository.ExpenseRepo;
import com.soumya.moneymanager.repository.IncomeRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExportService {

  private final IncomeRepo incomeRepo;
  private final ExpenseRepo expenseRepo;

  private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

  public byte[] exportPdf(Long userId) {
    List<IncomeEntity> incomes = incomeRepo.findByProfileId(userId);
    List<ExpenseEntity> expenses = expenseRepo.findByProfileId(userId);

    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
      Document document = new Document();
      PdfWriter.getInstance(document, out);
      document.open();

      Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
      Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

      // Incomes section
      document.add(new Paragraph("Income Report", headerFont));
      document.add(new Paragraph(" "));
      PdfPTable incomeTable = new PdfPTable(8);
      addHeaderRow(incomeTable, new String[]{"ID","Name","Category","Icon","Amount","Date","Created At","Updated At"}, cellFont);
      for (IncomeEntity i : incomes) {
        incomeTable.addCell(new Phrase(String.valueOf(i.getId()), cellFont));
        incomeTable.addCell(new Phrase(nz(i.getName()), cellFont));
        incomeTable.addCell(new Phrase(i.getCategory()!=null? nz(i.getCategory().getName()):"N/A", cellFont));
        incomeTable.addCell(new Phrase(nz(i.getIcon()), cellFont));
        incomeTable.addCell(new Phrase(i.getAmount()!=null? i.getAmount().toPlainString():"0.00", cellFont));
        incomeTable.addCell(new Phrase(i.getDate()!=null? i.getDate().format(DATE_FMT):"N/A", cellFont));
        incomeTable.addCell(new Phrase(i.getCreatedAt()!=null? i.getCreatedAt().format(DATE_FMT):"N/A", cellFont));
        incomeTable.addCell(new Phrase(i.getUpdatedAt()!=null? i.getUpdatedAt().format(DATE_FMT):"N/A", cellFont));
      }
      document.add(incomeTable);

      document.add(new Paragraph(" "));
      document.add(new Paragraph("Expense Report", headerFont));
      document.add(new Paragraph(" "));
      PdfPTable expenseTable = new PdfPTable(8);
      addHeaderRow(expenseTable, new String[]{"ID","Name","Category","Icon","Amount","Date","Created At","Updated At"}, cellFont);
      for (ExpenseEntity e : expenses) {
        expenseTable.addCell(new Phrase(String.valueOf(e.getId()), cellFont));
        expenseTable.addCell(new Phrase(nz(e.getName()), cellFont));
        expenseTable.addCell(new Phrase(e.getCategory()!=null? nz(e.getCategory().getName()):"N/A", cellFont));
        expenseTable.addCell(new Phrase(nz(e.getIcon()), cellFont));
        expenseTable.addCell(new Phrase(e.getAmount()!=null? e.getAmount().toPlainString():"0.00", cellFont));
        expenseTable.addCell(new Phrase(e.getDate()!=null? e.getDate().format(DATE_FMT):"N/A", cellFont));
        expenseTable.addCell(new Phrase(e.getCreatedAt()!=null? e.getCreatedAt().format(DATE_FMT):"N/A", cellFont));
        expenseTable.addCell(new Phrase(e.getUpdatedAt()!=null? e.getUpdatedAt().format(DATE_FMT):"N/A", cellFont));
      }
      document.add(expenseTable);

      document.close();
      return out.toByteArray();
    } catch (DocumentException de) {
      throw new RuntimeException("Error generating PDF: " + de.getMessage(), de);
    } catch (Exception ex) {
      throw new RuntimeException("Error generating PDF: " + ex.getMessage(), ex);
    }
  }

  public byte[] exportCsv(Long userId) {
    List<IncomeEntity> incomes = incomeRepo.findByProfileId(userId);
    List<ExpenseEntity> expenses = expenseRepo.findByProfileId(userId);

    try (ByteArrayOutputStream out = new ByteArrayOutputStream();
         java.io.OutputStreamWriter osw = new java.io.OutputStreamWriter(out, StandardCharsets.UTF_8);
         CSVWriter writer = new CSVWriter(osw)) {

      writer.writeNext(new String[]{"Income Report"});
      writer.writeNext(new String[]{"ID","Name","Category","Icon","Amount","Date","Created At","Updated At"});
      for (IncomeEntity i : incomes) {
        writer.writeNext(new String[] {
          String.valueOf(i.getId()),
          nz(i.getName()),
          i.getCategory()!=null? nz(i.getCategory().getName()):"N/A",
          nz(i.getIcon()),
          i.getAmount()!=null? i.getAmount().toPlainString():"0.00",
          i.getDate()!=null? i.getDate().format(DATE_FMT):"N/A",
          i.getCreatedAt()!=null? i.getCreatedAt().format(DATE_FMT):"N/A",
          i.getUpdatedAt()!=null? i.getUpdatedAt().format(DATE_FMT):"N/A"
        });
      }

      writer.writeNext(new String[]{""});
      writer.writeNext(new String[]{"Expense Report"});
      writer.writeNext(new String[]{"ID","Name","Category","Icon","Amount","Date","Created At","Updated At"});
      for (ExpenseEntity e : expenses) {
        writer.writeNext(new String[] {
          String.valueOf(e.getId()),
          nz(e.getName()),
          e.getCategory()!=null? nz(e.getCategory().getName()):"N/A",
          nz(e.getIcon()),
          e.getAmount()!=null? e.getAmount().toPlainString():"0.00",
          e.getDate()!=null? e.getDate().format(DATE_FMT):"N/A",
          e.getCreatedAt()!=null? e.getCreatedAt().format(DATE_FMT):"N/A",
          e.getUpdatedAt()!=null? e.getUpdatedAt().format(DATE_FMT):"N/A"
        });
      }

      writer.flush();
      return out.toByteArray();
    } catch (Exception e) {
      throw new RuntimeException("Error generating CSV: " + e.getMessage(), e);
    }
  }

  private static void addHeaderRow(PdfPTable table, String[] headers, Font font) {
    for (String h : headers) {
      PdfPCell cell = new PdfPCell(new Phrase(h, font));
      table.addCell(cell);
    }
  }

  private static String nz(String v) { return v == null ? "" : v; }
}
