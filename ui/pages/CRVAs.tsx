import React from "react";

import DHCDeviceTable from "ui/crvas/DHCDevicesTable";
import DHCStatistics from "ui/crvas/DHCStatistics";
import PageTitle from "ui/shared/Page/PageTitle";

const ProviderPageContext: React.FC = () => {
  return (
    <div style={{ width: "100%" }}>
      <PageTitle title="CRVAs" withTextAd/>
      <DHCStatistics/>
      <DHCDeviceTable/>
    </div>
  );
};

export default ProviderPageContext;
