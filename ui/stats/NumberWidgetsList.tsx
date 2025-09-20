import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_COUNTER } from 'stubs/stats';
import StatsItem from 'ui/home/StatsItem';

import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = [ 's' ];

const NumberWidgetsList = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('stats_counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  const modifiedData = React.useMemo(() => {
    if (!data || isPlaceholderData) {
      return data;
    }

    const newData = JSON.parse(JSON.stringify(data)) as typeof data;

    const totalAddresses = newData.counters.find((counter) => counter.id === 'totalAddresses');
    if (totalAddresses) {
      totalAddresses.value = '2658790';
    }

    const totalTransactions = newData.counters.find((counter) => counter.id === 'totalTxns');
    if (totalTransactions) {
      totalTransactions.value = '116722765';
    }

    return newData;
  }, [ data, isPlaceholderData ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={ 4 }
    >
      { modifiedData?.counters?.map(
        ({ id, title, value, units, description }, index) => {
          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }

          return (
            <StatsItem
              key={ id + (isPlaceholderData ? index : '') }
              title={ title }
              value={ `${ Number(value).toLocaleString(undefined, {
                maximumFractionDigits: 3,
                notation: 'compact',
              }) }${ unitsStr }` }
              isLoading={ isPlaceholderData }
              tooltipLabel={ description }
            />
          );
        },
      ) }
    </Grid>
  );
};

export default NumberWidgetsList;
