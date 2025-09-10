import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
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

    const karyawan = await prisma.karyawan.create({
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
    if (!body.username) {
      const firstName = body.name.split(" ")[0].toLowerCase();
      const roleOrJabatan = (body.position || "karyawan")
        .toLowerCase()
        .replace(/\s+/g, "_");
      body.username = `${firstName}_${roleOrJabatan}`;
    }
    if (!body.password) body.password = `${body.username}123`;
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        username: body.username,
        passwordHash,
        email: body.emailPribadi ?? null,
        role: body.role ?? "KARYAWAN",
        status: body.status ?? "AKTIF",
        karyawan: {
          connect: { customId: karyawan.customId } 
        }
      },
    });
    return NextResponse.json({ karyawan, user }, { status: 201 });
  } catch (error) {
    console.error("Error creating Pegawai:", error);
    return NextResponse.json(
      { error: "Failed to create Pegawai", details: error },
      { status: 500 }
    );
  }
}