import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

import type { Props } from "nextjs/getServerSideProps";
import PageNextJs from "nextjs/PageNextJs";

const DHCs = dynamic(() => import("ui/pages/CRVAs"), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/crvas" query={ props }>
      <DHCs/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from "nextjs/getServerSideProps";
