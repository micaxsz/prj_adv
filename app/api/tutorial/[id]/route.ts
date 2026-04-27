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
        id: parseInt(id),
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    const { judul, foto, kode_matkul, matkul, creator_email } =
      await request.json();
    console.log("Updating tutorial with ID:", id);
    const updatedTutorial = await prisma.tutorial.update({
      where: { id: parseInt(id) },
      data: {
        judul,
        foto,
        kode_matkul,
        matkul,
        creator_email,
      },
    });
    return new Response(JSON.stringify(updatedTutorial), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating tutorial:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update tutorial" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    console.log("Deleting tutorial with ID:", id);
    const deletedTutorial = await prisma.tutorial.delete({
      where: { id: parseInt(id) },
    });
    return new Response(JSON.stringify(deletedTutorial), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete tutorial" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
