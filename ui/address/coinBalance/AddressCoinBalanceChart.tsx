import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { currencyUnits } from 'lib/units';
import ChartWidget from 'ui/shared/chart/ChartWidget';

interface Props {
  addressHash: string;
}

const AddressCoinBalanceChart = ({ addressHash }: Props) => {
  const { data, isPending, isError } = useApiQuery('address_coin_balance_chart', {
    pathParams: { hash: addressHash },
  });

  const items = React.useMemo(() => data?.items?.map(({ date, value }) => ({
    date: new Date(date),
    value: BigNumber(value).div(10 ** config.chain.currency.decimals).toNumber(),
  })), [data]);

  return (
    <ChartWidget
      isError={isError}
      title="Balances"
      items={items}
      isLoading={isPending}
      h="300px"
      units={currencyUnits.ether}
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
