import { Table, Tbody, Tr, Th, Hide, Show } from "@chakra-ui/react";
import React from "react";

import { DHC_DEVICES } from "stubs/dhcDevices";
import { generateListStubOfBool } from "stubs/utils";
import ActionBar from "ui/shared/ActionBar";
import DataListDisplay from "ui/shared/DataListDisplay";
import Pagination from "ui/shared/pagination/Pagination";
import useQueryWithPagesOfBool from "ui/shared/pagination/useQueryWithPagesOfBool";
import { default as Thead } from "ui/shared/TheadSticky";

import { tableColumns } from "./data";
import DHCDeviceListItem from "./DHCDeviceListItem";
import DHCDeviceTableItem from "./DHCDeviceTableItem";

const PAGE_SIZE = 50;

const DHCDevicesTable = () => {
  const { data, isError, pagination, isPlaceholderData } =
    useQueryWithPagesOfBool({
      resourceName: "dhc_devices",
      filters: { pageSize: PAGE_SIZE },
      options: {
        placeholderData: generateListStubOfBool<"dhc_devices">(
          DHC_DEVICES,
          50,
          {
            hasNext: true,
            hasPrev: false,
            totalPage: 1,
            totalCount: "50",
          } as any,
        ),
      },
    });

  const actionBar = pagination.isVisible && (
    <ActionBar>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );
  const dataSource = React.useMemo(() => {
    return data?.items ?? [];
  }, [ data?.items ]);

  const tableCol = (
    <Thead top={ pagination.isVisible ? 80 : 0 }>
      <Tr>
        { tableColumns.map((item) => {
          return (
            <Th key={ item.id } width={ item.width } textAlign={ item.textAlgin }>
              { item.label }
            </Th>
          );
        }) }
      </Tr>
    </Thead>
  );

  const tableBody = (
    <Tbody>
      { dataSource.map((item, index) => {
        return (
          <DHCDeviceTableItem
            key={ index }
            data={ item }
            isLoaded={ !isPlaceholderData }
          />
        );
      }) }
    </Tbody>
  );

  const tableBodyForMobile = (
    <>
      { dataSource.map((item, index) => {
        return (
          <DHCDeviceListItem
            key={ index }
            data={ item }
            isLoaded={ !isPlaceholderData }
          />
        );
      }) }
    </>
  );

  const content = (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          { tableCol }
          { tableBody }
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          { tableBodyForMobile }
        </Table>
      </Show>
    </>
  );

  return (
    <div style={{ paddingTop: "24px" }}>
      <DataListDisplay
        isError={ isError }
        items={ dataSource }
        emptyText="There are no providers."
        content={ content }
        actionBar={ actionBar }
      />
    </div>
  );
};

export default DHCDevicesTable;
