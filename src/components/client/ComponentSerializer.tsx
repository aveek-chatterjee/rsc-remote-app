"use client";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

/**
 * Serializes a React component to a string representation
 * that can be transported between applications
 *
 * @param {React.ComponentType} Component - The component to serialize
 * @param {Object} props - Props to pass to the component
 * @returns {string} - Serialized component data
 */
// @ts-ignore
export function serializeComponent(
  Component: React.ComponentType,
  props: object = {}
): string {
  try {
    // Generate static markup with renderToStaticMarkup (doesn't include React attributes)
    const markup = renderToStaticMarkup(<Component {...props} />);

    // Create a serializable representation
    const serialized = {
      markup,
      componentName:
        Component.displayName || Component.name || "UnknownComponent",
      // Store the component definition as a string
      componentDefinition: Component.toString(),
      props,
    };

    // Convert to JSON string for transport
    return JSON.stringify(serialized);
  } catch (error) {
    console.error("Error serializing component:", error);
    throw error;
  }
}
