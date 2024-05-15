import type { DHCDevicePage, TableColumn } from "types/api/boolscan";

import dayjs from "lib/date/dayjs";
import { currencyUnits } from "lib/units";
import { formatAmount } from "lib/utils/helpers";

type DHCDevice = DHCDevicePage["items"][0];

export const tableColumns: Array<TableColumn<DHCDevice>> = [
  {
    id: "deviceId",
    label: "DID",
    width: "100px",
    textAlgin: "left",
    render: (data) => {
      return data.deviceId;
    },
  },
  {
    id: "deviceVersion",
    label: "Version",
    width: "100px",
    textAlgin: "center",
    render(data) {
      return data.deviceVersion;
    },
  },
  {
    id: "deviceStatus",
    label: "Status",
    width: "130px",
    textAlgin: "center",
  },
  {
    id: "createTime",
    label: "Created",
    width: "150px",
    textAlgin: "center",
    render: (data) => {
      return dayjs(Number(data.createTime)).format("YYYY-MM-DD HH:mm");
    },
  },
  {
    id: "totalStake",
    label: `Stake ${ currencyUnits.ether }`,
    width: "130px",
    textAlgin: "right",
    render: (data) => {
      return formatAmount(data.totalStake);
    },
  },
  {
    id: "punish",
    label: `Punish ${ currencyUnits.ether }`,
    width: "130px",
    textAlgin: "right",
    render: (data) => {
      return formatAmount(data.punish);
    },
  },
  {
    id: "income",
    label: `Reward ${ currencyUnits.ether }`,
    width: "130px",
    textAlgin: "right",
    render: (data) => {
      return formatAmount(data.income);
    },
  },
];
