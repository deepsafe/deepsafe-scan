import { Skeleton, HStack, Flex } from "@chakra-ui/react";
import React from "react";

import type { DHCDevicePage } from "types/api/boolscan";

import { route } from "nextjs-routes";

import * as EntityBase from "ui/shared/entities/base/components";
import ListItemMobile from "ui/shared/ListItemMobile/ListItemMobile";
import DHCDeviceConnection from "ui/shared/tags/DHCDeviceConnection";
import DHCStatusTag from "ui/shared/tags/HDCStatusTag";

import { tableColumns } from "./data";

const DHCDeviceListItem = ({
  data,
  isLoaded,
}: {
  data: DHCDevicePage["items"][0];
  isLoaded: boolean;
}) => {
  return (
    <ListItemMobile rowGap={ 3 }>
      { tableColumns.map((col, i) => {
        let content = col.render?.(data);
        if (i === 0) {
          content = (
            <Flex>
              <EntityBase.Link
                href={ route({
                  pathname: "/dhcs/[id]",
                  query: { id: data.deviceId },
                }) }
              >
                <EntityBase.Content
                  truncation="constant"
                  fontWeight={ 700 }
                  text={ data.deviceId }
                  maxW="100%"
                  isLoading={ !isLoaded }
                />
              </EntityBase.Link>

              <DHCDeviceConnection
                ml="10px"
                time={ Number(data.lastHeartBeat ?? 0) }
              />
            </Flex>
          );
        } else if (col.id === "deviceStatus") {
          content = <DHCStatusTag status={ data.status }/>;
        }
        return (
          <HStack key={ col.id } spacing={ 3 }>
            <Skeleton isLoaded={ isLoaded } fontSize="sm" fontWeight={ 500 }>
              { col.label }
            </Skeleton>
            <Skeleton
              isLoaded={ isLoaded }
              fontSize="sm"
              ml="auto"
              minW={ 10 }
              color="text_secondary"
            >
              { content }
            </Skeleton>
          </HStack>
        );
      }) }
    </ListItemMobile>
  );
};

export default DHCDeviceListItem;
