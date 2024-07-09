import { Response } from 'express';
import * as fs from 'fs';
import { Readable } from 'stream';
import { rootDir } from '../../root';
const puppeteer = require('puppeteer');
const hbs = require('hbs');

const ALLOWED_IMAGE_FILE_EXTENSIONS = /\/(jpg|jpeg|png|gif)$/;
const ALLOWED_VIDEO_FILE_EXTENSIONS =
  /\/(flv|mp4|m3u8|mov|avi|wmv|3gp|mkv|webm)$/;

const ALLOWED_VIDEO_FILE_EXTENSIONS_ALL = /video/;
const ALLOWED_FILE_EXTENSIONS =
  /\/(pdf|msword|txt|vnd.openxmlformats-officedocument.wordprocessingml.document|plain|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.pr|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/;

export const REGEX = {
  ALLOWED_IMAGE_FILE_EXTENSIONS,
  ALLOWED_VIDEO_FILE_EXTENSIONS: ALLOWED_VIDEO_FILE_EXTENSIONS_ALL,
  ALLOWED_FILE_EXTENSIONS,
};

async function compile(data: any, filePath: string): Promise<string> {
  try {
    const htmlData = await fs.readFileSync(filePath, 'utf-8');
    return await hbs.compile(htmlData)(data);
  } catch (error) {
    throw error;
  }
}

export async function generatePdf(
  reportData: any,
  fileName: string,
  templateFilePath: string,
  destinationDir: string,
): Promise<Buffer> {
  const fs = require('fs');
  const path = require('path');

  var templateHtml = fs.readFileSync(templateFilePath, 'utf8');
  var template = hbs.compile(templateHtml);
  var html = await template(reportData);

  const dir = path.join(rootDir(), destinationDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  var pdfPath = path.join(dir, fileName);

  let options = {
    path: pdfPath,
    preferCSSPageSize: true,
    printBackground: true,
  };

  let file = { content: html };
  const pdfBuffer = await createPDF(file, options);
  return pdfBuffer;
}

export function setDataAndHeaderInRes(
  res: Response,
  buffer: Buffer,
  fileName: string,
): Response {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  stream.pipe(res);
  setHeader(res, fileName);
  return res;
}

export function setHeader(res: Response, fileName: string) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + fileName + '.pdf',
  );
}

async function createPDF(file, options) {
  // we are using headless mode
  let args = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (options.args) {
    args = options.args;
    delete options.args;
  }

  const browser = await puppeteer.launch({
    args: args,
  });
  const page = await browser.newPage();
  // let data:any;
  if (file.content) {
    // data = await inlineCss(file.content, {url:"/"});
    await page.setContent(file.content, {
      waitUntil: 'networkidle0', // wait for page to load completely
    });
  } else {
    await page.goto(file.url, {
      waitUntil: ['load', 'networkidle0'], // wait for page to load completely
    });
  }

  await page.pdf(options);

  await browser.close();
  return Buffer.from(Object.values<any>(file.content));
}
