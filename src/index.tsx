import React, { HTMLAttributes } from "react";

import { useQuery, ReactQueryProviderConfig } from "react-query";

function bytesAsString(bytes: number) {
  if (bytes > 1_024) {
    return `${Math.round((bytes / 1_024) * 10) / 10} kB`;
  }

  return `${bytes} B`;
}

const getBundleDetails = async (_: string, packageName: string) => {
  const response = await fetch(
    `https://bundlephobia.com/api/size?package=${packageName}`
  );

  return response.json();
};

export function useBundlephobia(
  packageName: string,
  reactQueryOptions: ReactQueryProviderConfig = {}
) {
  return useQuery(["bundlephobia", packageName], getBundleDetails, {
    staleTime: 15 * 60_000,
    ...reactQueryOptions
  });
}

export interface BundlephobiaProps extends HTMLAttributes<HTMLDivElement> {
  packageName: string;
}

export function Bundlephobia({ packageName }: BundlephobiaProps) {
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
          {packageName}
          {packageName.lastIndexOf("@") <= 0 && <>@{data.version}</>}
        </Wrapper>
      </code>
      &nbsp;-&nbsp;
      <small>{bytesAsString(data.gzip)} MINIFIED + GZIPPED</small>
    </>
  );
}
