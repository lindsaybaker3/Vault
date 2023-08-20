package org.example.domain;

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
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
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

    private final ReportsJdbcTemplateRepository repository;
    private final TransactionsJdbcTemplateRepository transactionsRepository;
    private final AppUserJdbcTemplateRepository appUserRepository;

    @Autowired
    public ReportsService(ReportsJdbcTemplateRepository repository, TransactionsJdbcTemplateRepository transactionsRepository, AppUserJdbcTemplateRepository appUserRepository) {
        this.repository = repository;
        this.transactionsRepository = transactionsRepository;
        this.appUserRepository = appUserRepository;
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
            report = repository.create(report);
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

        //first and last name  , start date e enddate e goaltype
        //goal type , category,amount , description , date
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd");
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyyMMddhhmmssa");

        String fileName = appUser.getFirstName() + " " + appUser.getLastName() + "_" + dateFormat.format(report.getStartDate()) + "_" + dateFormat.format(report.getEndDate()) + "_" + dateTimeFormat.format(new Date());

//        URL url = this.getClass().getClassLoader().getResource("reports/");



        //Initialize PDF writer
        String filePath = System.getProperty("user.dir") + "/reports/" +  fileName + ".pdf";
        report.setReportUrl(filePath);
        PdfWriter writer = new PdfWriter(filePath);

        //Initialize PDF document
        PdfDocument pdf = new PdfDocument(writer);

        // Initialize document
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

    public Result download(int reportId){
        Result result = new Result();

        Reports report = repository.findById(reportId);
        File file = new File(report.getReportUrl());

       result.setPayload(file);
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

        if (report.getGoalType() == null || report.getGoalType().isEmpty()) {
            result.addErrorMessage("Goal type is required.", ResultType.INVALID);
        }

        return result;
    }



}
