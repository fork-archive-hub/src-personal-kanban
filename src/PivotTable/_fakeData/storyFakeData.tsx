import faker from 'faker';
import * as React from 'react';

import { Icon } from '@habx/ui-core';

import { ImageCell } from '../cell/ImageCell';
import { BooleanCell, BooleanFilter, IMEXColumn, RangeFilter } from '../index';
import type { Column } from '../types/Table';

export function range(length) {
  return Array(length).fill(1);
}

const GROUPS = ['分组A', '分组B', '分组C'];

export const FAKE_DATA = range(8).map((item, idx) => ({
  ...faker.helpers.createCard(),
  image: faker.helpers.randomize([
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/02e27c05f756816d97983027afe8310a.jpg',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/326355d6d0a0f4018c7b2bc6b35d7e00.jpg',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/c0dc8559767798d6cba8ee18a913ad0a.jpg',
  ]),
  done: faker.helpers.randomize([true, false, null, undefined]),
  price: Math.round(Math.random() * 10000),
  // id: Math.random(),
  id: idx + 1,
  group: GROUPS[Math.floor(Math.random() * Math.floor(3))],
}));

export const BASIC_COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Username lorem',
    accessor: (el) => el.name,
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'City',
    accessor: (el) => el.address.city,
  },
] as Column<Faker.Card>[];

export const RICH_COLUMNS = [
  {
    Header: 'Customer',
    accessor: (el) => el.name,
    HeaderIcon: <Icon icon='person' />,
  },
  {
    Header: 'Invoice amount',
    accessor: 'price',
    Cell: ({ value }: { value: string }) => `$${value}`,
    Filter: RangeFilter,
    filter: 'between',
  },
  {
    Header: 'Image',
    accessor: 'image',
    Cell: ImageCell,
    Filter: () => null,
  },
  {
    Header: 'Done',
    accessor: 'done',
    Cell: BooleanCell,
    Filter: BooleanFilter,
    filter: 'equals',
  },
] as Column<typeof FAKE_DATA[0]>[];

export const IMEX_COLUMNS = [
  {
    Header: 'Username',
    accessor: 'username',
    meta: {
      imex: {
        identifier: true,
        type: 'string' as const,
      },
    },
  },
  {
    Header: 'Name',
    accessor: 'name',
    meta: {
      imex: {
        type: 'string' as const,
        note: 'This is a comment',
      },
    },
  },
  {
    Header: 'Email',
    accessor: 'email',
    meta: {
      imex: {
        type: 'string' as const,
      },
    },
  },
  {
    Header: 'City',
    accessor: 'address.city',
    meta: {
      imex: {
        type: 'string' as const,
      },
    },
  },
] as IMEXColumn<Faker.Card & { id: number }>[];
