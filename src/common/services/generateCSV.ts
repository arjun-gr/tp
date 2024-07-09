import * as fs from 'fs';
import * as path from 'path';
import { rootDir } from '../../../root';
const csvWriter = require('csv-writer');

export const generateCSV = async (
  records: unknown[],
  header: unknown[],
  name: string,
) => {
  try {
    const filename = `${name}.csv`;
    const filePath = path.join(getDownloadDirectory(), filename);
    const writer = csvWriter.createObjectCsvWriter({
      path: filePath,
      header: header,
    });
    await writer.writeRecords(records);
    return filePath;
  } catch (error) {
    console.log('error : ', error);
  }
};

const getDownloadDirectory = () => {
  const downloadDir = 'downloads';
  const dir = path.resolve(rootDir(), downloadDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};
