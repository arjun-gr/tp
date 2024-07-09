export const serviceFilesResponseFormat = (serviceFiles: any) => {
  const files = [];
  if (!serviceFiles?.length) return files;
  for (const file of serviceFiles) {
    let fileObj: any = {};
    fileObj.id = file.id;
    fileObj.fileType = file.fileType;
    fileObj.serviceId = file.service.id;
    fileObj.serviceProductId = file.serviceProduct.id;
    fileObj.file = file.fileId;
    files.push(fileObj);
  }
  return files;
};
