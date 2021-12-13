import * as React from "react";
import { usePagination } from "react-table";
import styled from "styled-components";

import { FAKE_DATA, BASIC_COLUMNS } from "../../_fakeData/storyFakeData";
import { Table } from "../../Table";
import { useTable } from "../../useTable";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`;

export default {
  title: "Plugins/usePagination [built in]",
};

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: BASIC_COLUMNS,
      pageSizeOptions: [5, 10, 15, 20],
    },
    usePagination
  );

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  );
};
