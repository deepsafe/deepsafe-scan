import { useRouter } from "next/router";
import React from "react";

import useApiQuery from "lib/api/useApiQuery";
import { useAppContext } from "lib/contexts/app";
import { formatAmount } from "lib/utils/helpers";
import DHCDetails from "ui/crva/DHCDetails";
import DHCStatistic from "ui/crva/DHCStatistic";
import PageTitle from "ui/shared/Page/PageTitle";

const HDCContext: React.FC = ({}) => {
  const appProps = useAppContext();
  const router = useRouter();
  const deviceId = router.query.id;

  const { data, isLoading } = useApiQuery("dhc_device", {
    queryParams: {
      deviceId: deviceId,
    },
  });

  const backLink = React.useMemo(() => {
    const hasGoBackLink =
      appProps.referrer && appProps.referrer.includes("/crvas");

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: "Back to HDC list",
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);
  return (
    <div style={{ width: "100%" }}>
      <PageTitle title="DHC details" withTextAd backLink={ backLink }/>
      { deviceId && (
        <DHCDetails
          deviceDetails={ data }
          isLoading={ isLoading }
        />
      ) }
      { deviceId && (
        <DHCStatistic
          deviceId={ deviceId as string }
          totalPunish={ formatAmount(data?.punish ?? "0") }
          totalReward={ formatAmount(data?.income ?? "0") }
          punishCount={ Number(data?.punishCount ?? 0) }
          isLoaded={ true }
        />
      ) }
    </div>
  );
};

export default HDCContext;
