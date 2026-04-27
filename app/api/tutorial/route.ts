import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.tutorial.findMany({
      include: {
        detail_tutorial: true,
      },
    });
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const judul = body.judul as string;
    const foto = body.foto as string;
    const kode_matkul = body.kode_matkul as string;
    const matkul = body.matkul as string;
    const creator_email = body.creator_email as string;

    if (!judul || !foto || !kode_matkul || !matkul || !creator_email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const slug = judul.toLowerCase().replace(/\s+/g, "-");

    const url_presentation = slug + "-" + Math.floor(Math.random() * 10000);
    const url_finished = slug + "-" + Math.floor(Math.random() * 10000);

    const newTutorial = await prisma.tutorial.create({
      data: {
        judul,
        foto,
        kode_matkul,
        matkul,
        creator_email,
        url_presentation,
        url_finished,
      },
    });
    return new Response(JSON.stringify(newTutorial), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating tutorial:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create tutorial" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
