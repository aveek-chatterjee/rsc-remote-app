import { ReactNode, ReactElement, ComponentType, Fragment } from "react";

type ReactAny =
  | ReactNode
  | ReactElement
  | Promise<ReactElement>
  | ComponentType<any>
  | any;

// Handle primitive values (null, undefined, boolean, string, number)
function handlePrimitive(element: ReactAny): string {
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
  // @ts-ignore
  return null; // Not a primitive
}

// Handle arrays of React elements
function handleArray(elements: ReactAny[]): string {
  return elements.map((child) => elementToString(child)).join("");
}

// Process React component attributes/props
function processAttributes(props: Record<string, any>): string {
  return Object.entries(props || {})
    .filter(([key]) => key !== "children" && key !== "key" && key !== "ref")
    .map(([key, value]) => processAttribute(key, value))
    .join("");
}

// Process a single attribute/prop
function processAttribute(key: string, value: any): string {
  // Handle style objects
  if (key === "style" && typeof value === "object") {
    return processStyleAttribute(value);
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
}

// Process style attribute
function processStyleAttribute(
  styleObj: Record<string, string | number>
): string {
  const styleString = Object.entries(styleObj)
    .map(([k, v]) => {
      // Convert camelCase to kebab-case
      const kebabKey = k.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebabKey}:${v}`;
    })
    .join(";");
  return ` style="${styleString}"`;
}

// Process children or dangerouslySetInnerHTML
function processChildren(props: Record<string, any>): string {
  if (
    props?.dangerouslySetInnerHTML &&
    typeof props.dangerouslySetInnerHTML === "object"
  ) {
    const dangerousHtml = (props.dangerouslySetInnerHTML as { __html: string })
      .__html;
    return typeof dangerousHtml === "string" ? dangerousHtml : "";
  } else if (props?.children) {
    return elementToString(props.children);
  }
  return "";
}

// Determine the tag name for a React element
function getTagName(type: string | Function | object): string {
  if (typeof type === "string") {
    // HTML element
    return type;
  } else if (typeof type === "function") {
    // Function component
    return (type as any).displayName || (type as Function).name || "Component";
  } else if (type && typeof type === "object") {
    // Handle server components or forwarded refs
    return (type as any).displayName || (type as any).name || "ServerComponent";
  } else {
    // Unknown component type fallback
    return "UnknownComponent";
  }
}

// Render function component
function renderFunctionComponent(type: Function, props: any): string {
  try {
    // Try to render the component with its props
    const renderedElement = type(props);
    return elementToString(renderedElement);
  } catch (e) {
    // If rendering fails, return an empty string
    console.warn(`Failed to render component ${getTagName(type)}:`, e);
    return "";
  }
}

// Check if an element is a fragment
function isFragment(type: any): boolean {
  return type === Fragment || type?.toString() === "Symbol(react.fragment)";
}

// Check if tag is a void element (self-closing)
function isVoidElement(tagName: string): boolean {
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
  return voidElements.has(tagName.toLowerCase());
}

// Handle React elements
function handleReactElement(element: ReactElement): string {
  const { type, props } = element;

  // Handle fragments
  if (isFragment(type)) {
    return elementToString(props.children);
  }

  // Handle function components
  if (typeof type === "function") {
    return renderFunctionComponent(type, props);
  }

  // Get tag name
  const tagName = getTagName(type);

  // Process attributes and children
  const attributes = processAttributes(props);
  const children = processChildren(props);

  // Return appropriate string representation
  if (isVoidElement(tagName)) {
    return `<${tagName}${attributes} />`;
  } else {
    return `<${tagName}${attributes}>${children}</${tagName}>`;
  }
}

// Main function to convert React elements to string
export function elementToString(element: ReactAny): string {
  // Handle primitive values
  const primitiveResult = handlePrimitive(element);
  console.log("Line 207", primitiveResult)
  if (primitiveResult !== null) {
    return primitiveResult;
  }

  // Handle arrays
  if (Array.isArray(element)) {
    return handleArray(element);
  }

  // Check if it's a valid React element
  if (
    element &&
    typeof element === "object" &&
    element.$$typeof &&
    (element.$$typeof.toString() === "Symbol(react.element)" ||
      element.$$typeof === Symbol.for("react.element"))
  ) {
    return handleReactElement(element as ReactElement);
  }

  // Fallback for other cases
  try {
    return String(element);
  } catch {
    return "";
  }
}
