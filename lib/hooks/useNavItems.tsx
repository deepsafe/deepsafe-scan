import { useRouter } from 'next/router';
import React from 'react';

import type {
  NavItemInternal,
  NavItem,
  NavGroupItem,
  NavItemExternal,
} from 'types/client/navigation-items';

import config from 'configs/app';
import { rightLineArrow } from 'lib/html-entities';
import UserAvatar from 'ui/shared/UserAvatar';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
  profileItem: NavItem;
}

export function isGroupItem(
  item: NavItem | NavGroupItem,
): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

function networkName() {
  if (config.chain.isDevNet) {
    return 'alpha_testnet';
  } else if (config.chain.isTestnet) {
    return 'testnet';
  }  else if (config.chain.isBetaMainNet) {
    return 'beta_mainnet';
  } else {
    return 'mainnet';
  }
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = !config.UI.views.address.hiddenViews
      ?.top_accounts ?
      {
        text: 'Top accounts',
        nextRoute: { pathname: '/accounts' as const },
        icon: 'top-accounts',
        isActive: pathname === '/accounts',
      } :
      null;
    const blocks: NavItem | null = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: 'block',
      isActive:
        pathname === '/blocks' || pathname === '/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: 'transactions',
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
    };
    const userOps: NavItem | null = config.features.userOps.isEnabled ?
      {
        text: 'User operations',
        nextRoute: { pathname: '/ops' as const },
        icon: 'user_op',
        isActive: pathname === '/ops' || pathname === '/op/[hash]',
      } :
      null;

    const verifiedContracts: NavItem | null = {
      text: 'Verified contracts',
      nextRoute: { pathname: '/verified-contracts' as const },
      icon: 'verified',
      isActive: pathname === '/verified-contracts',
    };
    const ensLookup = config.features.nameService.isEnabled ?
      {
        text: 'Name services lookup',
        nextRoute: { pathname: '/name-domains' as const },
        icon: 'ENS',
        isActive:
            pathname === '/name-domains' || pathname === '/name-domains/[name]',
      } :
      null;

    const validators: NavItem | undefined = config.app.hideNevs.includes(
      '/validators',
    ) ?
      undefined :
      {
        text: 'Validators',
        nextRoute: { pathname: '/validators' as const },
        icon: 'bool/nodes',
        isActive: pathname.startsWith('/validators'),
      }; // beta testnet 中不显示

    if (config.features.zkEvmRollup.isEnabled) {
      blockchainNavItems = [
        [
          txs,
          userOps,
          blocks,
          validators,
          {
            text: 'Txn batches',
            nextRoute: { pathname: '/zkevm-l2-txn-batches' as const },
            icon: 'txn_batches',
            isActive:
              pathname === '/zkevm-l2-txn-batches' ||
              pathname === '/zkevm-l2-txn-batch/[number]',
          },
        ].filter(Boolean),
        [ topAccounts, verifiedContracts, ensLookup ].filter(Boolean),
      ];
    } else if (config.features.optimisticRollup.isEnabled) {
      blockchainNavItems = [
        [
          txs,
          // eslint-disable-next-line max-len
          {
            text: `Deposits (L1${ rightLineArrow }L2)`,
            nextRoute: { pathname: '/l2-deposits' as const },
            icon: 'arrows/south-east',
            isActive: pathname === '/l2-deposits',
          },
          // eslint-disable-next-line max-len
          {
            text: `Withdrawals (L2${ rightLineArrow }L1)`,
            nextRoute: { pathname: '/l2-withdrawals' as const },
            icon: 'arrows/north-east',
            isActive: pathname === '/l2-withdrawals',
          },
        ],
        [
          blocks,
          // eslint-disable-next-line max-len
          {
            text: 'Txn batches',
            nextRoute: { pathname: '/l2-txn-batches' as const },
            icon: 'txn_batches',
            isActive: pathname === '/l2-txn-batches',
          },
          // eslint-disable-next-line max-len
          {
            text: 'Output roots',
            nextRoute: { pathname: '/l2-output-roots' as const },
            icon: 'output_roots',
            isActive: pathname === '/l2-output-roots',
          },
        ],
        [ userOps, topAccounts, verifiedContracts, ensLookup ].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        userOps,
        blocks,
        validators,
        topAccounts,
        verifiedContracts,
        ensLookup,
        config.features.beaconChain.isEnabled && {
          text: 'Withdrawals',
          nextRoute: { pathname: '/withdrawals' as const },
          icon: 'arrows/north-east',
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const apiNavItems: Array<NavItem> = [
      config.features.restApiDocs.isEnabled ?
        {
          text: 'REST API',
          nextRoute: { pathname: '/api-docs' as const },
          icon: 'restAPI',
          isActive: pathname === '/api-docs',
        } :
        null,
      config.features.graphqlApiDocs.isEnabled ?
        {
          text: 'GraphQL',
          nextRoute: { pathname: '/graphiql' as const },
          icon: 'graphQL',
          isActive: pathname === '/graphiql',
        } :
        null,
      !config.UI.sidebar.hiddenLinks?.rpc_api && {
        text: 'RPC API',
        icon: 'RPC',
        url: 'https://docs.blockscout.com/for-users/api/rpc-endpoints',
      },
      !config.UI.sidebar.hiddenLinks?.eth_rpc_api && {
        text: 'Eth RPC API',
        icon: 'RPC',
        url: ' https://docs.blockscout.com/for-users/api/eth-rpc',
      },
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: 'Blockchain',
        icon: 'globe-b',
        isActive: blockchainNavItems
          .flat()
          .some((item) => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: 'Tokens',
        nextRoute: { pathname: '/tokens' as const },
        icon: 'token',
        isActive: pathname.startsWith('/token'),
      },
      config.features.marketplace.isEnabled ?
        {
          text: 'Apps',
          nextRoute: { pathname: '/apps' as const },
          icon: 'apps',
          isActive: pathname.startsWith('/app'),
        } :
        null,
      config.features.stats.isEnabled ?
        {
          text: 'Charts & Sats',
          nextRoute: { pathname: '/stats' as const },
          icon: 'stats',
          isActive: pathname === '/stats',
        } :
        null,
      apiNavItems.length > 0 && {
        text: 'API',
        icon: 'restAPI',
        isActive: apiNavItems.some(
          (item) => isInternalItem(item) && item.isActive,
        ),
        subItems: apiNavItems,
      },
      config.app.hideNevs.includes('/crvas') ?
        undefined :
        {
          text: 'CRVAs',
          nextRoute: { pathname: '/crvas' as const },
          icon: 'bool/provider',
          isActive: pathname.startsWith('/crvas'),
        }, // beta testnet 中不显示
      {
        text: 'Ecosystem',
        icon: 'ecosystem',
        subItems: [
          {
            text: 'Dashboard',
            url: `https://dashboard.boolscan.com?network=${ networkName() }`,
          },
          {
            text: 'Bridge Explorer',
            url: `https://bridge.deepsafe.network?network=${ networkName() }`,
          },
          {
            text: 'Validators',
            url: `https://validators.deepsafe.network?network=${ networkName() }`,
          },
          // {
          //   text: 'Oracle Explorer',
          //   url: `https://oracle.boolscan.com?network=${ networkName() }`,
          // },
        ] as Array<NavItemExternal>,
      },
      {
        text: 'Others',
        icon: 'gear',
        subItems: [
          {
            text: 'Verify contract',
            nextRoute: { pathname: '/contract-verification' as const },
            isActive: pathname.startsWith('/contract-verification'),
          },
          ...config.UI.sidebar.otherLinks,
        ],
      },
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'privattags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: 'Public tags',
        nextRoute: { pathname: '/account/public-tags-request' as const },
        icon: 'publictags',
        isActive: pathname === '/account/public-tags-request',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'API',
        isActive: pathname === '/account/api-key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'ABI',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'verified',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    const profileItem = {
      text: 'My profile',
      nextRoute: { pathname: '/auth/profile' as const },
      iconComponent: UserAvatar,
      isActive: pathname === '/auth/profile',
    };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ pathname ]);
}
