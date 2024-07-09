export const serviceInvoiceList = async (services: any) => {
  if (!services?.length) return [];
  let response = [];
  services.forEach((service: any) => {
    let serviceDetail: any = {};
    const branchProducts = service?.purchase?.branchProduct;
    serviceDetail.clientName = service?.client?.name;
    serviceDetail.branchName = service?.purchase?.branch?.name;
    serviceDetail.id = service.id;
    serviceDetail.date = service.date;
    if (branchProducts?.length) {
      branchProducts.forEach((element: any) => {
        let product = element?.product?.name;
        if (product) {
          serviceDetail.serviceType = `${product} ${service.type}`;
          serviceDetail.duration = element?.serviceType;
        }
      });
    }
    if (serviceDetail?.serviceType) {
      response.push(serviceDetail);
    }
  });
  return response;
};
