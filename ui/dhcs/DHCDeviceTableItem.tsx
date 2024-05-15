import { Skeleton, Tr, Td } from "@chakra-ui/react";
import React from "react";

import type { DHCDevicePage } from "types/api/boolscan";

import { route } from "nextjs-routes";

import * as EntityBase from "ui/shared/entities/base/components";
import DHCStatusTag from "ui/shared/tags/HDCStatusTag";

import { tableColumns } from "./data";

const DHCDeviceTableItem = ({
  data,
  isLoaded,
}: {
  data: DHCDevicePage["items"][0];
  isLoaded: boolean;
}) => {
  return (
    <Tr>
      { tableColumns.map((col, i) => {
        let content = col.render?.(data);

        if (i === 0) {
          content = (
            <EntityBase.Link
              href={ route({
                pathname: "/dhcs/[id]",
                query: { id: data.deviceId },
              }) }
            >
              { }

              <EntityBase.Content
                truncation="constant"
                fontWeight={ 700 }
                text={ data.deviceId }
                maxW="100%"
                isLoading={ !isLoaded }
              />
            </EntityBase.Link>
          );
        } else if (col.id === "deviceStatus") {
          content = <DHCStatusTag status={ data.status }/>;
        }

        return (
          <Td key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            <Skeleton
              isLoaded={ isLoaded }
              display="inline-block"
              minW={ 10 }
              lineHeight="24px"
            >
              { content }
            </Skeleton>
          </Td>
        );
      }) }
    </Tr>
  );
};

export default DHCDeviceTableItem;
