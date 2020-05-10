import React from "react";
import { Bundlephobia, useBundlephobia } from ".";

export default {
  title: "Bundlephobia"
};

export function AsHook() {
  // Simple wrapper for react-query + the bundlephobia API
  const response = useBundlephobia("react-query");
  const data: any = response.data;

  return (
    <>
      Can be used with hooks:
      <h1>{data.name}</h1>
      <p>
        <em>{data.repository}</em>
      </p>
      <p>{data.description}</p>
    </>
  );
}

export function AsComponent() {
  return <Bundlephobia packageName="react-query" />;
}
