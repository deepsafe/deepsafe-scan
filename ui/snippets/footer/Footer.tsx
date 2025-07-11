import type { GridProps } from '@chakra-ui/react';
import {
  Box,
  Grid,
  Flex,
  Text,
  Link,
  VStack,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
// import useApiQuery from "lib/api/useApiQuery";
import useFetch from 'lib/hooks/useFetch';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
// import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 4;

// const FRONT_VERSION_URL = `https://github.com/boolnetwork/boolscan/tree/${ config.UI.footer.frontendVersion }`;
// const FRONT_COMMIT_URL = `https://github.com/boolnetwork/boolscan/commit/${ config.UI.footer.frontendCommit }`;

const Footer = () => {
  // const { data: backendVersionData } = useApiQuery("config_backend_version", {
  //   queryOptions: {
  //     staleTime: Infinity,
  //   },
  // });
  // const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  // const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      text: 'GitHub',
      url: 'https://github.com/deepsafe/deepsafe-scan',
    },
    {
      icon: 'social/tweet' as const,
      iconSize: '18px',
      text: 'Twitter',
      url: 'https://x.com/DeepSafe_AI',
    },
  ];

  // const frontendLink = (() => {
  //   if (config.UI.footer.frontendVersion) {
  //     return <Link href={ FRONT_VERSION_URL } target="_blank">{ config.UI.footer.frontendVersion }</Link>;
  //   }

  //   if (config.UI.footer.frontendCommit) {
  //     return <Link href={ FRONT_COMMIT_URL } target="_blank">{ config.UI.footer.frontendCommit }</Link>;
  //   }

  //   return null;
  // })();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<
  unknown,
  ResourceError<unknown>,
  Array<CustomLinksGroup>
  >({
    queryKey: [ 'footer-links' ],
    queryFn: async() =>
      fetch(config.UI.footer.links || '', undefined, {
        resource: 'footer-links',
      }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ?
    1 :
    Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Flex
          gridArea={ gridArea }
          flexWrap="wrap"
          columnGap={ 8 }
          rowGap={ 6 }
          mb={{ base: 5, lg: 10 }}
          _empty={{ display: 'none' }}
        >
          { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
          <NetworkAddToWallet/>
        </Flex>
      );
    },
    [],
  );

  const renderProjectInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Box gridArea={ gridArea }>
          <HStack spacing={ 1 }>
            <Image
              src="/favicon/favicon-footer.png"
              alt="DeepSafe Scan"
              unoptimized
              width={ 30 }
              height={ 30 }
            />
            <Text fontSize="md">
              Powered by{ ' ' }
              <Link fontSize="md" href="https://deepsafe.network">
                  DeepSafe
              </Link>
            </Text>
          </HStack>
          <Text mt={ 3 } fontSize="xs">
              DeepSafe Scan is a Block Explorer and Analytics Platform for the DeepSafe Network.
          </Text>
          { /* <VStack spacing={ 1 } mt={ 6 } alignItems="start">
          { apiVersionUrl && (
            <Text fontSize="xs">
              Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { frontendLink && (
            <Text fontSize="xs">
              Frontend: { frontendLink }
            </Text>
          ) }
        </VStack> */ }
        </Box>
      );
    },
    [],
  );

  const containerProps: GridProps = {
    as: 'footer',
    px: { base: 4, lg: 12 },
    py: { base: 4, lg: 9 },
    borderTop: '1px solid',
    borderColor: 'divider',
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
  };

  if (config.UI.footer.links) {
    return (
      <Grid { ...containerProps }>
        <div>
          { renderNetworkInfo() }
          { renderProjectInfo() }
        </div>

        <Grid
          gap={{
            base: 6,
            lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8,
            xl: 12,
          }}
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 160px)',
            lg: `repeat(${ colNum }, 135px)`,
            xl: `repeat(${ colNum }, 160px)`,
          }}
          justifyContent={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          { [
            { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
            ...(linksData || []),
          ]
            .slice(0, colNum)
            .map((linkGroup) => (
              <Box key={ linkGroup.title }>
                <Skeleton
                  fontWeight={ 500 }
                  mb={ 3 }
                  display="inline-block"
                  isLoaded={ !isPlaceholderData }
                >
                  { linkGroup.title }
                </Skeleton>
                <VStack spacing={ 1 } alignItems="start">
                  { linkGroup.links.map((link) => (
                    <FooterLinkItem
                      { ...link }
                      key={ link.text }
                      isLoading={ isPlaceholderData }
                    />
                  )) }
                </VStack>
              </Box>
            )) }
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      { ...containerProps }
      gridTemplateAreas={{
        lg: `
          "network links-top"
          "info links-bottom"
        `,
      }}
    >
      { renderNetworkInfo({ lg: 'network' }) }
      { renderProjectInfo({ lg: 'info' }) }

      <Grid
        gridArea={{ lg: 'links-bottom' }}
        gap={ 1 }
        gridTemplateColumns={{
          base: 'repeat(auto-fill, 160px)',
          lg: 'repeat(3, 160px)',
          xl: 'repeat(4, 160px)',
        }}
        gridTemplateRows={{
          base: 'auto',
          lg: 'repeat(3, auto)',
          xl: 'repeat(2, auto)',
        }}
        gridAutoFlow={{ base: 'row', lg: 'column' }}
        alignContent="start"
        justifyContent={{ lg: 'flex-end' }}
        mt={{ base: 8, lg: 0 }}
      >
        { BLOCKSCOUT_LINKS.map((link) => (
          <FooterLinkItem { ...link } key={ link.text }/>
        )) }
      </Grid>
    </Grid>
  );
};

export default React.memo(Footer);
