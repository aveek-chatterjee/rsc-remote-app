import { NextRequest, NextResponse } from "next/server";
import ServerComponent from "@/components/server/ServerComponent";
import { elementToString } from "@/app/element-to-string";
import { JSX } from "react";

const serverComponentToString = async (
  props: (props: any) => Promise<JSX.Element>
): Promise<string> => {
  try {
    const renderedComponent = await ServerComponent(props);
    return elementToString(renderedComponent);
  } catch (error) {
    console.error("Error converting server component to string:", error);
    return "";
  }
};

export async function POST(request: NextRequest) {
  try {
    const serverCompInstance = await serverComponentToString(ServerComponent);
    const htmlString = serverCompInstance;
    // Create the component HTML directly without using renderToString
    const serverHTML = `${htmlString}`;
    return new NextResponse(`${serverHTML}`);
  } catch (error) {
    console.error("Error rendering component:", error);
    return NextResponse.json(
      { error: "Failed to render component" },
      { status: 500 }
    );
  }
}
