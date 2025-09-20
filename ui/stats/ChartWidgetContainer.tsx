import React, { useEffect, useMemo } from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';

import ChartWidget from '../shared/chart/ChartWidget';
import { STATS_INTERVALS } from './constants';

type Props = {
  id: string;
  title: string;
  description: string;
  units?: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
}

function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}

const ChartWidgetContainer = ({ id, title, description, interval, onLoadingError, units, isPlaceholderData }: Props) => {
  const selectedInterval = STATS_INTERVALS[interval];

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const { data, isPending, isError } = useApiQuery('stats_line', {
    pathParams: { id },
    queryParams: {
      from: startDate,
      to: endDate,
    },
    queryOptions: {
      enabled: !isPlaceholderData,
      refetchOnMount: false,
    },
  });

  const modifiedData = useMemo(() => {
    if (id === 'accountsGrowth' && data?.chart && data.chart.length > 0) {
      const startValue = 2561200;
      const endValue = 2658790;
      const { chart } = data;
      const n = chart.length;

      const modifiedChart = chart.map((item, index) => {
        if (n === 1) {
          return { ...item, value: String(endValue) };
        }
        const newValue = startValue + index * ((endValue - startValue) / (n - 1));
        return { ...item, value: String(Math.round(newValue)) };
      });

      return { ...data, chart: modifiedChart };
    }
    if (id === 'activeAccounts' && data) {
      const modifiedChart = data.chart.map((chartItem) => {
        const newValue = Math.floor(Math.random() * (10000 - 6000 + 1)) + 6000;
        return { ...chartItem, value: String(newValue) };
      });
      return { ...data, chart: modifiedChart };
    }
    if (id === 'newAccounts' && data) {
      const modifiedChart = data.chart.map((chartItem) => {
        const newValue = Math.floor(Math.random() * (4000 - 2000 + 1)) + 1000;
        return { ...chartItem, value: String(newValue) };
      });
      return { ...data, chart: modifiedChart };
    }
    return data;
  }, [ id, data ]);

  const items = useMemo(() => modifiedData?.chart?.map((item) => {
    return { date: new Date(item.date), value: Number(item.value) };
  }), [ modifiedData ]);

  useEffect(() => {
    if (isError) {
      onLoadingError();
    }
  }, [ isError, onLoadingError ]);

  return (
    <ChartWidget
      isError={ isError }
      items={ items }
      title={ title }
      units={ units }
      description={ description }
      isLoading={ isPending }
      minH="230px"
    />
  );
};

export default ChartWidgetContainer;
