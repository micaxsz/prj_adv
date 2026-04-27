import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    console.log("Fetching tutorial with ID:", id);
    const data = await prisma.tutorial.findUnique({
      where: {
        url_finished: id,
      },
      include: {
        detail_tutorial: true,
      },
    });
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return new Response(JSON.stringify({ error: "Tutorial not found" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
