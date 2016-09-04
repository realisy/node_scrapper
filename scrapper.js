"use strict"

const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const csvPath = process.env.CSV_PATH || "test.csv";

request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(body)

    let fileStrs = $('tr').map(function () {
      let filePermission = $(this).children().first().text();
      let filePath = $(this).find('td:nth-child(3) a').attr('href');
      let fileName = $(this).find('a').text();
      return [filePermission, filePath, fileName].join(",");
    }).get();

    let csv = "";
    fileStrs.forEach(function(fileStr, index) {
      csv += index < fileStrs.length ? fileStr + "\n" : fileStr;
    });
    fs.writeFile(csvPath, csv);

    console.log("---Success---")
  }
});
