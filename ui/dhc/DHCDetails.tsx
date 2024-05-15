import { Skeleton, Grid, Flex, Text } from "@chakra-ui/react";
import React from "react";

import type {
  DHCDevice,

} from "types/api/boolscan";

import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";
import CopyToClipboard from "ui/shared/CopyToClipboard";
import DetailsInfoItem from "ui/shared/DetailsInfoItem";
import HashStringShortenDynamic from "ui/shared/HashStringShortenDynamic";
import DHCDeviceConnection from "ui/shared/tags/DHCDeviceConnection";
import DHCStatusTag from "ui/shared/tags/HDCStatusTag";

const DHCDetails = ({
  deviceDetails,
  isLoading,
}: {
  deviceDetails?: DHCDevice;
  isLoading: boolean;
}) => {
  const formData = React.useMemo(() => {
    return [
      {
        id: "device",
        label: "Device",
        value: (
          <HashStringShortenDynamic hash={ deviceDetails?.deviceId ?? "" }/>
        ),
      },
      {
        id: "version",
        label: "Version",
        value: deviceDetails?.deviceVersion,
      },
      {
        id: "allowVotes",
        label: "Allow votes",
        value: (
          <Text
            color={ deviceDetails?.isAllowedStake ? "green.300" : "red.300" }
          >
            { deviceDetails?.isAllowedStake ?
              "Allow new votes" :
              "Refuse new votes" }
          </Text>
        ),
      },
      {
        id: "feetRate",
        label: "Commission",
        value: (deviceDetails?.feeRatio ?? 0) + "%",
      },
      {
        id: "status",
        label: "Status",
        value: (
          <Flex alignItems="center">
            <DHCStatusTag status={ deviceDetails?.status }/>

            <DHCDeviceConnection
              ml="10px"
              time={ Number(deviceDetails?.lastHeartBeat ?? 0) }
            />
          </Flex>
        ),
      },
      {
        id: "stake",
        label: "Stake",
        value: `${ formatAmount(deviceDetails?.income ?? "0") } ${
          currencyUnits.ether
        }`,
      },

      {
        id: "createTime",
        label: "Create Time",
        value: dayjs(Number(deviceDetails?.createTime ?? "0")).format(
          "YYYY-MM-DD HH:mm",
        ),
      },
    ];
  }, [ deviceDetails ]);

  return (
    <Grid
      columnGap={ 4 }
      rowGap={{ base: 1, lg: 2 }}
      templateColumns={{ base: "minmax(0, 1fr)", lg: "auto minmax(0, 1fr)" }}
      overflow="hidden"
    >
      { formData.map((item) => {
        return (
          <DetailsInfoItem
            key={ item.id }
            title={ item.label }
            alignSelf="center"
            flexWrap="nowrap"
            isLoading={ isLoading }
          >
            <Skeleton
              isLoaded={ !isLoading }
              display="inline-block"
              overflow="hidden"
            >
              { item.value }
            </Skeleton>
            { item.id === "device" ? (
              <CopyToClipboard
                text={ deviceDetails?.deviceId ?? "" }
                isLoading={ isLoading }
              />
            ) : null }
          </DetailsInfoItem>
        );
      }) }
    </Grid>
  );
};

export default DHCDetails;
