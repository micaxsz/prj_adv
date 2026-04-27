import { status, tipe } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    console.log("Fetching tutorial with ID:", id);
    const data = await prisma.detail_tutorial.delete({
      where: {
        id: parseInt(id),
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const tipe = body.tipe as tipe;
    const order = body.order as number;
    const isi = body.isi as string;
    const status = body.status as status;

    const data = await prisma.detail_tutorial.update({
      where: {
        id: parseInt(id),
      },
      data: {
        tipe,
        order,
        isi,
        status,
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
