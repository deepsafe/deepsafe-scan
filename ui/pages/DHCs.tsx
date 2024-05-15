import React from "react";

import DHCDeviceTable from "ui/dhcs/DHCDevicesTable";
import DHCStatistics from "ui/dhcs/DHCStatistics";
import PageTitle from "ui/shared/Page/PageTitle";

const ProviderPageContext: React.FC = () => {
  return (
    <div style={{ width: "100%" }}>
      <PageTitle title="DHCs" withTextAd/>
      <DHCStatistics/>
      <DHCDeviceTable/>
    </div>
  );
};

export default ProviderPageContext;
