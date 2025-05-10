import { ReactNode, ReactElement, ComponentType, Fragment } from "react";

type ReactAny =
  | ReactNode
  | ReactElement
  | Promise<ReactElement>
  | ComponentType<any>
  | any;
type ElementToStringResult = string | Promise<string>;

export function elementToString(element: ReactAny): string {
  // Handle null, undefined, or boolean values
  if (
    element === null ||
    element === undefined ||
    typeof element === "boolean"
  ) {
    return "";
  }

  // Handle primitive types (strings and numbers)
  if (typeof element === "string" || typeof element === "number") {
    return String(element);
  }

  // Handle arrays (like fragments or multiple children)
  if (Array.isArray(element)) {
    return element.map((child) => elementToString(child)).join("");
  }

  // Check if it's a valid React element
  if (
    element &&
    typeof element === "object" &&
    element.$$typeof &&
    (element.$$typeof.toString() === "Symbol(react.element)" ||
      element.$$typeof === Symbol.for("react.element"))
  ) {
    const { type, props } = element as ReactElement;

    // Handle fragments
    if (type === Fragment || type?.toString() === "Symbol(react.fragment)") {
      return elementToString(props.children);
    }

    // Determine tag name
    let tagName: string;
    if (typeof type === "string") {
      // HTML element
      tagName = type;
    } else if (typeof type === "function") {
      // Function component
      try {
        // Try to render the component with its props
        // @ts-ignore
        const renderedElement = type(props);
        return elementToString(renderedElement);
      } catch (e) {
        // Fallback to component name if rendering fails
        tagName =
          (type as any).displayName || (type as Function).name || "Component";
        console.warn(`Failed to render component ${tagName}:`, e);
      }
    } else if (type && typeof type === "object") {
      // Handle server components or forwarded refs
      tagName =
        (type as any).displayName || (type as any).name || "ServerComponent";
    } else {
      // Unknown component type fallback
      tagName = "UnknownComponent";
    }

    // Special handling for void elements (self-closing tags)
    const voidElements = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]);

    // Process attributes
    const attributes = Object.entries(props || {})
      .filter(([key]) => key !== "children" && key !== "key" && key !== "ref")
      .map(([key, value]) => {
        // Handle style objects
        if (key === "style" && typeof value === "object") {
          const styleObj = value as Record<string, string | number>;
          const styleString = Object.entries(styleObj)
            .map(([k, v]) => {
              // Convert camelCase to kebab-case
              const kebabKey = k.replace(/([A-Z])/g, "-$1").toLowerCase();
              return `${kebabKey}:${v}`;
            })
            .join(";");
          return ` style="${styleString}"`;
        }

        // Handle event handlers (skip them)
        if (key.startsWith("on") && typeof value === "function") {
          return "";
        }

        // Handle className
        if (key === "className") {
          return ` class="${value}"`;
        }

        // Handle dangerouslySetInnerHTML
        if (
          key === "dangerouslySetInnerHTML" &&
          value &&
          typeof value === "object" &&
          "__html" in value
        ) {
          return ""; // We'll handle this separately when processing children
        }

        // Handle boolean attributes
        if (typeof value === "boolean") {
          return value ? ` ${key}` : "";
        }

        // Handle objects and arrays (convert to JSON string)
        if (typeof value === "object" && value !== null) {
          try {
            return ` ${key}="${JSON.stringify(value).replace(/"/g, "&quot;")}"`;
          } catch (e) {
            return "";
          }
        }

        // Handle regular string and number attributes
        if (typeof value === "string" || typeof value === "number") {
          return ` ${key}="${value}"`;
        }

        return "";
      })
      .join("");

    // Process children or dangerouslySetInnerHTML
    let children = "";
    if (
      props?.dangerouslySetInnerHTML &&
      typeof props.dangerouslySetInnerHTML === "object"
    ) {
      const dangerousHtml = (
        props.dangerouslySetInnerHTML as { __html: string }
      ).__html;
      children = typeof dangerousHtml === "string" ? dangerousHtml : "";
    } else if (props?.children) {
      children = elementToString(props.children);
    }

    // Return appropriate string representation
    if (voidElements.has(tagName.toLowerCase())) {
      return `<${tagName}${attributes} />`;
    } else {
      return `<${tagName}${attributes}>${children}</${tagName}>`;
    }
  }

  // Fallback for other cases
  try {
    return String(element);
  } catch {
    return "";
  }
}
