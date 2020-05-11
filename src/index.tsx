import React, { HTMLAttributes } from "react";

import { useQuery, ReactQueryProviderConfig } from "react-query";

//
// Shamelessly stolen from https://github.com/thelostone-mc/importcost/blob/master/lib/utils.js
// all hail thelostone-mc 🙏
//
function bytesAsString(bytes: number, mantissa = 2) {
  if (bytes == 0) return 0;
  const NUMBER_OF_PEAS_IN_A_POD = 1024;
  const METRIC_LIST = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const powerToBeRaisedTo = Math.floor(
    Math.log(bytes) / Math.log(NUMBER_OF_PEAS_IN_A_POD)
  );
  return (
    parseFloat(
      (bytes / Math.pow(NUMBER_OF_PEAS_IN_A_POD, powerToBeRaisedTo)).toFixed(
        mantissa
      )
    ) +
    " " +
    METRIC_LIST[powerToBeRaisedTo]
  );
}

async function getBundleDetails(_: string, packageName: string) {
  const response = await fetch(
    `https://bundlephobia.com/api/size?package=${packageName}`
  );

  return response.json();
}

export function useBundlephobia(
  packageName: string,
  reactQueryOptions: ReactQueryProviderConfig = {}
) {
  return useQuery(["bundlephobia", packageName], getBundleDetails, {
    staleTime: 15 * 60_000,
    ...reactQueryOptions
  });
}

export interface BundlephobiaInlineProps
  extends HTMLAttributes<HTMLDivElement> {
  packageName: string;
}

export function BundlephobiaInline({ packageName }: BundlephobiaInlineProps) {
  const { status, data, error } = useBundlephobia(packageName);

  if (status === "loading") {
    return (
      <span>
        <code>{packageName}</code>
      </span>
    );
  }

  if (status === "error") {
    return (
      <span>
        <code>{packageName}</code> Error: {(error as any).message}
      </span>
    );
  }

  const Wrapper = data.repository
    ? (wrapperProps: any) => <a {...wrapperProps} />
    : (wrapperProps: any) => <span {...wrapperProps} />;

  return (
    <>
      <code>
        <Wrapper href={data.repository}>
          {data ? data.name : packageName}
          {data && data.name.lastIndexOf("@") <= 0 && <>@{data.version}</>}
        </Wrapper>
      </code>
      &nbsp;-&nbsp;
      <small>{bytesAsString(data.gzip)} MINIFIED + GZIPPED</small>
    </>
  );
}

export default BundlephobiaInline;
