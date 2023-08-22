package org.example.domain;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.util.IOUtils;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.example.data.AppUserJdbcTemplateRepository;
import org.example.data.ReportsJdbcTemplateRepository;
import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.AppUser;
import org.example.models.Reports;
import org.example.models.Transactions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.net.URL;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class ReportsService {

    @Value("${download.path}")
    private String downloadPath;

    @Autowired
    private AmazonS3 s3Client;

    private static final String BUCKET_NAME = "vault-spring-amazon-storage";


    private final ReportsJdbcTemplateRepository repository;
    private final TransactionsJdbcTemplateRepository transactionsRepository;
    private final AppUserJdbcTemplateRepository appUserRepository;

    @Autowired
    public ReportsService(ReportsJdbcTemplateRepository repository, TransactionsJdbcTemplateRepository transactionsRepository, AppUserJdbcTemplateRepository appUserRepository) {
        this.repository = repository;
        this.transactionsRepository = transactionsRepository;
        this.appUserRepository = appUserRepository;
    }

    public  List<Reports> findByUserId(int appUserId){
        return repository.findByUserId(appUserId);
    }


    public Result create(Reports report) {
        Result result = validate(report);

        if (report != null && report.getReportId() > 0) {
            result.addErrorMessage("Report `id` should not be set.", ResultType.INVALID);
        }

        List<Transactions> transactionsList = transactionsRepository.findByUserId( report.getAppUserId(), report.getStartDate(), report.getEndDate(), report.getGoalType());
        try {
            generateTransactionsReport(report, transactionsList);
        } catch (FileNotFoundException e) {
            result.addErrorMessage("It's not possible to save the report", ResultType.INVALID);
        }


        if (result.isSuccess()) {
            report.setReportUrl("");
            report = repository.create(report);
            report.setReportUrl(String.format(downloadPath,report.getReportId()));
            repository.update(report);
            if(report != null) {
                result.setPayload(report);
            }else{
                result.addErrorMessage("It's not possible to save the report", ResultType.INVALID);
            }
        }

        return result;
    }


    private void generateTransactionsReport(Reports report , List<Transactions> transactionsList) throws FileNotFoundException {

        AppUser appUser =  appUserRepository.findById(report.getAppUserId());

        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd");
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyyMMddhhmmssa");

        String fileName = appUser.getFirstName() + " " + appUser.getLastName()
                + "_" + dateFormat.format(report.getStartDate())
                + "_" + dateFormat.format(report.getEndDate())
                + ".pdf";

        ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(pdfOutputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);


        //Add paragraph to the document
        Paragraph paragraph = new Paragraph();
        paragraph.add("Name: " + appUser.getFirstName() + " " + appUser.getLastName() + "\n");
        paragraph.add("Goal type: " + report.getGoalType() + "\n");
        paragraph.add("Start Date: " + dateFormat.format(report.getStartDate()) + "\n");
        paragraph.add("End Date: " + dateFormat.format(report.getEndDate()) + "\n");

        document.add(paragraph);
        document.add(createTable(transactionsList));

        //Close document
        document.close();


        byte[] pdfBytes = pdfOutputStream.toByteArray();

        try (InputStream inputStream = new ByteArrayInputStream(pdfBytes)) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(pdfBytes.length);

            s3Client.putObject(BUCKET_NAME, fileName, inputStream, metadata);


        } catch (IOException e) {
            // Handle exceptions
        }
    }



    private static Table createTable(List<Transactions> transactionsList) {
        Table table = new Table(5); // 5 columns

        table.useAllAvailableWidth();


        // Add table headers
        addTableHeader(table);

        // Add table rows

        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DecimalFormat decimalFormat = new DecimalFormat("###,###.00");

        for (Transactions transaction : transactionsList) {
            addTableRow(table, transaction.getGoalType(), transaction.getCategory(), decimalFormat.format(transaction.getAmount()), transaction.getDescription(), dateFormat.format(transaction.getTransactionDate()));
        }

        return table;
    }

    private static void addTableHeader(Table table) {
        String[] headers = {"Goal Type", "Category", "Amount", "Description", "Date"};

        for (String header : headers) {
            Cell cell = (new Cell()).add(new Paragraph(header));
            table.addCell(cell);
        }
    }



    private static void addTableRow(Table table, String goalType, String category,
                                    String amount, String description, String date) {
        Cell cellGoalType = new Cell().add(new Paragraph(goalType));
        Cell cellCategory = new Cell().add(new Paragraph(category));
        Cell cellAmount = new Cell().add(new Paragraph(amount));
        Cell cellDescription = new Cell().add(new Paragraph(description));
        Cell cellDate = new Cell().add(new Paragraph((date)));

        table.addCell(cellGoalType);
        table.addCell(cellCategory);
        table.addCell(cellAmount);
        table.addCell(cellDescription);
        table.addCell(cellDate);
    }

//    public Result download(int reportId){
//        Result result = new Result();
//
//        Reports report = repository.findById(reportId);
//        File file = new File(report.getReportUrl());
//
//       result.setPayload(file);
//        return result;
//    }



    public Result download(int reportId, String fileName) {
        Result result = new Result();

        Reports report = repository.findById(reportId);
        AppUser appUser =  appUserRepository.findById(report.getAppUserId());

        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd");
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyyMMddhhmmssa");

         fileName = appUser.getFirstName() + " " + appUser.getLastName()
                + "_" + dateFormat.format(report.getStartDate())
                + "_" + dateFormat.format(report.getEndDate())
                + ".pdf";


        try {
            S3Object s3Object = s3Client.getObject(BUCKET_NAME, fileName);
            // You can now process the S3Object, for example, by reading its content
            // and sending it as a response. Here's a simplified version:

            InputStream objectInputStream = s3Object.getObjectContent();
            byte[] objectBytes = IOUtils.toByteArray(objectInputStream);

            result.setPayload(objectBytes);

            // Close the input stream
            objectInputStream.close();

        } catch (Exception e) {
            result.addErrorMessage("Error downloading file from S3: " + e.getMessage(),ResultType.INVALID);
        }

        return result;
    }




    public Result deleteById(int reportId) {
        Result result = new Result();

        if (!repository.deleteById(reportId)) {
            result.addErrorMessage("Report id %s was not found.", ResultType.NOT_FOUND, reportId);
        }
        return result;
    }


    private Result validate(Reports report) {
        Result result = new Result();

        if (report == null) {
            result.addErrorMessage("Report cannot be null.", ResultType.INVALID);
            return result;
        }

        if (report.getStartDate() == null || report.getEndDate() == null) {
            result.addErrorMessage("Start date and End date cannot be null.", ResultType.INVALID);
        } else if (report.getStartDate().isAfter(report.getEndDate())) {
            result.addErrorMessage("End date cannot be before start date.", ResultType.INVALID);
        }

        if (report.getEndDate().isAfter(LocalDate.now())) {
            result.addErrorMessage("Report End date cannot be in the future.", ResultType.INVALID);
        }

        if (report.getGoalType() == null || report.getGoalType().isEmpty()) {
            result.addErrorMessage("Goal type is required.", ResultType.INVALID);
        }

        return result;
    }



}
