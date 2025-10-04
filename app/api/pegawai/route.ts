import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }
  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const pegawaiList = await prisma.karyawan.findMany({
      include: { user: true },
    })

    const data = pegawaiList.map(p => ({
      id: p.customId,
      nik: p.nik,
      nip: p.nip,
      name: p.name,
      phone: p.phone,
      emailPribadi: p.emailPribadi,
      username: p.user?.username,
      department: p.department,
      position: p.position,
      jenisKelamin: p.jenisKelamin,
      agama: p.agama,
      status: p.status,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Karyawan:", error)
    return NextResponse.json(
      { error: "Failed to fetch Karyawan" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lastKaryawan = await prisma.karyawan.findFirst({
      orderBy: { customId: "desc" },
    });

    let nextNumber = 1;
    if (lastKaryawan?.customId) {
      nextNumber = parseInt(lastKaryawan.customId.split("-")[1], 10) + 1;
    }
    const customId = `USR-${String(nextNumber).padStart(3, "0")}`;

    if (!body.username) {
      const nameParts = body.name.trim().split(/\s+/);
      const firstName = nameParts[0].toLowerCase();
      const roleOrJabatan = (body.position || "karyawan")
        .toLowerCase()
        .replace(/\s+/g, "_");

      let baseUsername = `${firstName}_${roleOrJabatan}`;
      let candidate = baseUsername;
      let counter = 1;
      let exists = await prisma.user.findUnique({ where: { username: candidate } });
      while (exists) {
        candidate = `${baseUsername}${counter}`;
        exists = await prisma.user.findUnique({ where: { username: candidate } });
        counter++;
      }

      body.username = candidate;
    }

    if (!body.password) body.password = `${body.username}123`;
    const passwordHash = await bcrypt.hash(body.password, 10);
    const result = await prisma.$transaction(async (tx) => {
      const karyawan = await tx.karyawan.create({
        data: {
          customId,
          name: body.name,
          nip: body.nip,
          nik: body.nik,
          npwp: body.npwp,
          emailPribadi: body.emailPribadi,
          phone: body.phone,
          address: body.address,
          birthDate: body.birthDate,
          tempatLahir: body.tempatLahir,
          jenisKelamin: body.jenisKelamin,
          agama: body.agama,
          joinDate: body.joinDate,
          position: body.position,
          department: body.department,
          pendidikan: body.pendidikan,
          golongan: body.golongan,
          kontakDarurat: body.kontakDarurat,
          hubunganDarurat: body.hubunganDarurat,
          status: body.status ?? "AKTIF",
        },
      });

      const user = await tx.user.create({
        data: {
          username: body.username,
          passwordHash,
          email: body.emailPribadi ?? null,
          role: body.role ?? "KARYAWAN",
          status: body.status ?? "AKTIF",
          karyawan: {
            connect: { customId: karyawan.customId },
          },
        },
      });

      return { karyawan, user };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    console.error("Error creating Pegawai:", error);
    return NextResponse.json(
      { error: "Failed to create Pegawai", details: error.message },
      { status: 500 }
    );
  }
}
