import { Grid } from "@chakra-ui/react";
import type { IconName } from "public/icons/name";
import React, { useMemo } from "react";

import type { DHCDeviceInfo } from "types/api/boolscan";

import useApiQuery from "lib/api/useApiQuery";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";
import StatsItem from "ui/home/StatsItem";

const DHCStatistics = () => {
  const { data, isLoading } = useApiQuery("dhc_devices_info");

  const statsList = useMemo<
  Array<{
    id: keyof DHCDeviceInfo;
    label: string;
    value: string;
    icon: IconName;
  }>
  >(() => {
    const statsData = (key: keyof DHCDeviceInfo) => {
      const _data = data;
      const value = _data?.[key] ?? "0";
      let amount = "0";

      if (key === "totalDevices") {
        return _data?.[key] ?? "0";
      }

      if (value) {
        amount = formatAmount(value);
      }
      return `${ amount } ${ currencyUnits.ether }`;
    };
    return [
      {
        id: "totalDevices",
        label: "Total CRVA",
        icon: "bool/device",
        value: statsData("totalDevices"),
      },
      {
        id: "totalCurrentStake",
        label: "Total Stake",
        icon: "bool/stake",
        value: statsData("totalCurrentStake"),
      },
      {
        id: "totalPunish",
        label: "Total Punish",
        icon: "bool/punish",
        value: statsData("totalPunish"),
      },
      {
        id: "totalReward",
        label: "Total Reward",
        icon: "bool/reward",
        value: statsData("totalReward"),
      },
    ];
  }, [ data ]);

  return (
    <Grid
      gridTemplateColumns={{
        lg: `repeat(${ statsList.length }, 1fr)`,
        base: "1fr 1fr",
      }}
      gridTemplateRows={{ lg: "none", base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { statsList.map((item) => {
        return (
          <StatsItem
            key={ item.id }
            icon={ item.icon }
            title={ item.label }
            value={ item.value }
            isLoading={ isLoading }
          />
        );
      }) }
    </Grid>
  );
};

export default DHCStatistics;
