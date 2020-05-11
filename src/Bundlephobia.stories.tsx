import React from "react";
import { withKnobs, text as textKnob } from "@storybook/addon-knobs";
import { BundlephobiaInline, useBundlephobia } from "./index";

export default {
  title: "Bundlephobia",
  decorators: [withKnobs]
};

export function AsHook() {
  const packageName = textKnob("packageName", "react-query");

  // Simple wrapper for react-query + the bundlephobia API
  const response = useBundlephobia(packageName);
  const { status } = response;
  const data: any = response.data;

  return (
    <>
      Can be used with hooks:
      {status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        "Error"
      ) : (
        <>
          <h1>{data.name}</h1>
          <p>
            <em>{data.repository}</em>
          </p>
          <p>{data.description}</p>
        </>
      )}
    </>
  );
}

export function AsComponent() {
  const packageName = textKnob("packageName", "react-query");

  return <BundlephobiaInline packageName={packageName} />;
}
