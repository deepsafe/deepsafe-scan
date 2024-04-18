import React from "react";

import type { TransactionType } from "types/api/transaction";

import Tag from "ui/shared/chakra/Tag";

export interface Props {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER = [
  "rootstock_remasc",
  "rootstock_bridge",
  "token_creation",
  "contract_creation",
  "token_transfer",
  "contract_call",
  "coin_transfer",
  "100",
  "101",
  "102",
  "103",
  "104",
  "105",
  "106",
  "107",
  "108",
  "109",
  "110",
  "110",
  "111",
  "112",
  "113",
  "114",
  "115",
  "116",
  "117",
];

const TxType = ({ types, isLoading }: Props) => {
  const typeToShow = types.sort(
    (t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2),
  )[0];

  let label;
  let colorScheme;

  switch (typeToShow) {
    case "contract_call":
      label = "Contract call";
      colorScheme = "blue";
      break;
    case "contract_creation":
      label = "Contract creation";
      colorScheme = "blue";
      break;
    case "token_transfer":
      label = "Token transfer";
      colorScheme = "orange";
      break;
    case "token_creation":
      label = "Token creation";
      colorScheme = "orange";
      break;
    case "coin_transfer":
      label = "Transfer";
      colorScheme = "orange";
      break;
    case "rootstock_remasc":
      label = "REMASC";
      colorScheme = "blue";
      break;
    case "rootstock_bridge":
      label = "Bridge";
      colorScheme = "blue";
      break;
    case "100":
    case "101":
    case "110":
      label = "Claim";
      colorScheme = "orange";
      break;
    case "102":
    case "111":
    case "112":
    case "113":
    case "114":
      label = "Stake";
      colorScheme = "orange";
      break;
    case "103":
    case "115":
      label = "Unstake";
      colorScheme = "orange";
      break;
    case "105":
    case "106":
    case "107":
    case "108":
    case "109":
    case "116":
    case "117":
      label = "Config";
      colorScheme = "orange";
      break;
    case "104":
    case "118":
      label = "Delegate";
      colorScheme = "orange";
      break;
    default:
      label = "Transaction";
      colorScheme = "purple";
  }

  return (
    <Tag colorScheme={ colorScheme } isLoading={ isLoading }>
      { label }
    </Tag>
  );
};

export default TxType;
