package com.soumya.moneymanager.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.service.ExportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/export")
@RequiredArgsConstructor
public class ExportController {

  private final ExportService exportService;

  @GetMapping("/pdf/{userId}")
  public ResponseEntity<byte[]> exportPdf(@PathVariable Long userId) {
    byte[] bytes = exportService.exportPdf(userId);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finance_export_" + userId + ".pdf")
        .contentType(MediaType.APPLICATION_PDF)
        .body(bytes);
  }

  @GetMapping("/csv/{userId}")
  public ResponseEntity<byte[]> exportCsv(@PathVariable Long userId) {
    byte[] bytes = exportService.exportCsv(userId);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finance_export_" + userId + ".csv")
        .contentType(MediaType.parseMediaType("text/csv"))
        .body(bytes);
  }
}
