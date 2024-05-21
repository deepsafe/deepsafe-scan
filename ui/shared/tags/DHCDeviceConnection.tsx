import type { HTMLChakraProps } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

import dayjs from "lib/date/dayjs";
dayjs.extend(relativeTime);

interface Props extends Omit<HTMLChakraProps<"div">, "title"> {
  time: number;
}

const DHCDeviceConnection = ({ time, ...style }: Props) => {
  const textColor = () => {
    const diff = dayjs().diff(dayjs(time), "minute");
    if (diff < 10) {
      return "#4ade80";
    } else if (diff < 20) {
      return "#fbbf24";
    } else {
      return "#f87171";
    }
  };

  return (
    <Text color={ textColor() } fontSize="16px" fontWeight={ 500 } { ...style }>
      { dayjs(time).from(dayjs()) }
    </Text>
  );
};

export default DHCDeviceConnection;
