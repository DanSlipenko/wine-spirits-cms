'use client';

import * as React from 'react';
import { Table, Input, Button, Space, ConfigProvider } from 'antd';
import type { TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';

export type InventoryRow = {
  id: string;
  location: string;
  itemSku: string;
  itemNumber: string;
  itemDescription: string;
  onHand: number;
  allocated: number;
  available: number;
  onOrder: number;
  ytdCases: number;
  mtdCases: number;
  last30DayCases: number;
  last60DayCases: number;
  last90DayCases: number;
  onHandValue: number;
};

const formatNum = (n: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

type TextKey = 'location' | 'itemNumber' | 'itemDescription';

function getSearchFilter(
  dataIndex: TextKey,
  placeholder: string,
): Pick<
  TableColumnType<InventoryRow>,
  'filterDropdown' | 'filterIcon' | 'onFilter'
> {
  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div className="p-2" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          autoFocus
          placeholder={`Search ${placeholder}`}
          value={selectedKeys[0] as string | undefined}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          className="mb-2 block w-56"
        />
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => confirm()}
          >
            Search
          </Button>
          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex] ?? '')
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  };
}

const numericCol = (
  title: string,
  key: keyof InventoryRow,
  width = 110,
): TableColumnType<InventoryRow> => ({
  title,
  dataIndex: key,
  key: String(key),
  width,
  align: 'right',
  sorter: (a, b) => Number(a[key]) - Number(b[key]),
  render: (v: number) => formatNum(Number(v) || 0),
});

export function InventoryTable({ data }: { data: InventoryRow[] }) {
  const columns: TableColumnsType<InventoryRow> = [
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      ...getSearchFilter('location', 'location'),
    },
    {
      title: 'Item #',
      dataIndex: 'itemNumber',
      key: 'itemNumber',
      width: 110,
      ...getSearchFilter('itemNumber', 'item #'),
    },
    {
      title: 'Item Description',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 320,
      ellipsis: true,
      ...getSearchFilter('itemDescription', 'description'),
    },
    numericCol('On Hand', 'onHand'),
    numericCol('Allocated', 'allocated'),
    numericCol('Available', 'available'),
    numericCol('On Order', 'onOrder'),
    numericCol('YTD Cases', 'ytdCases'),
    numericCol('MTD Cases', 'mtdCases'),
    numericCol('30 Day Cases', 'last30DayCases'),
    numericCol('60 Day Cases', 'last60DayCases'),
    numericCol('90 Day Cases', 'last90DayCases'),
  ];

  const summaryKeys: (keyof InventoryRow)[] = [
    'onHand',
    'allocated',
    'available',
    'onOrder',
    'ytdCases',
    'mtdCases',
    'last30DayCases',
    'last60DayCases',
    'last90DayCases',
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          borderRadius: 4,
        },
        components: {
          Table: {
            headerBg: '#fafafa',
            headerColor: '#1f2937',
            rowHoverBg: '#f5f5f5',
          },
        },
      }}
    >
      <Table<InventoryRow>
        rowKey="id"
        size="small"
        bordered
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 25,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
        summary={(pageData) => {
          const totals: Partial<Record<keyof InventoryRow, number>> = {};
          for (const key of summaryKeys) {
            totals[key] = pageData.reduce(
              (sum, row) => sum + (Number(row[key]) || 0),
              0,
            );
          }
          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="bg-zinc-50 font-semibold">
                <Table.Summary.Cell index={0} colSpan={3}>
                  Totals
                </Table.Summary.Cell>
                {summaryKeys.map((k, i) => (
                  <Table.Summary.Cell
                    key={String(k)}
                    index={3 + i}
                    align="right"
                  >
                    {formatNum(totals[k] ?? 0)}
                  </Table.Summary.Cell>
                ))}
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </ConfigProvider>
  );
}
