import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';

const prisma = new PrismaClient();

const normalizeStr = (str: string | null | undefined) =>
  (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const isSameAddress = (a: any, b: any): boolean => {
  if (!a || !b) return false;
  if (a.id && b.id && a.id === b.id) return true;

  const zipA = normalizeStr(a.postalCode || a.zipCode);
  const zipB = normalizeStr(b.postalCode || b.zipCode);

  if (zipA && zipB && zipA !== zipB) return false;

  const lineA = normalizeStr(a.addressLine1 || a.street);
  const lineB = normalizeStr(b.addressLine1 || b.street);

  if (!lineA || !lineB) return false;
  if (lineA === lineB) return true;
  if (lineA.includes(lineB) || lineB.includes(lineA)) return true;

  const prefixA = lineA.slice(0, 12);
  const prefixB = lineB.slice(0, 12);
  if (prefixA.length >= 6 && prefixA === prefixB) return true;

  return false;
};

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  const uniqueAddresses: typeof addresses = [];
  const duplicateIdsToDelete: string[] = [];

  for (const addr of addresses) {
    const existingIdx = uniqueAddresses.findIndex((item) => isSameAddress(item, addr));

    if (existingIdx === -1) {
      uniqueAddresses.push(addr);
    } else {
      const existing = uniqueAddresses[existingIdx];
      const isExistingPlaceholder = existing.phone === "0000000000" || !existing.phone;
      const isNewReal = addr.phone && addr.phone !== "0000000000";

      if ((addr.isDefault && !existing.isDefault) || (isExistingPlaceholder && isNewReal)) {
        duplicateIdsToDelete.push(existing.id);
        uniqueAddresses[existingIdx] = addr;
      } else {
        duplicateIdsToDelete.push(addr.id);
      }
    }
  }

  // Asynchronously clean up duplicate placeholder rows from database
  if (duplicateIdsToDelete.length > 0) {
    const mainAddr = uniqueAddresses[0];
    Promise.all(
      duplicateIdsToDelete.map(async (dupId) => {
        try {
          if (mainAddr) {
            await prisma.order.updateMany({
              where: { addressId: dupId },
              data: { addressId: mainAddr.id },
            });
          }
          await prisma.address.delete({ where: { id: dupId } });
        } catch (e) {
          // ignore cleanup errors
        }
      })
    ).catch(() => {});
  }

  res.status(200).json({
    status: 'success',
    data: uniqueAddresses,
  });
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    postalCode,
    country,
    addressType,
    isDefault,
  } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
    throw new ApiError(400, 'All fields except addressLine2 and landmark are required');
  }

  // Check if address with same street & postalCode already exists for this user
  const userAddresses = await prisma.address.findMany({ where: { userId } });
  const newAddrObj = { addressLine1, postalCode, city };

  const existingDuplicate = userAddresses.find((a) => isSameAddress(a, newAddrObj));

  const count = userAddresses.length;
  const makeDefault = count === 0 ? true : !!isDefault;

  if (makeDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  if (existingDuplicate) {
    // Update existing address instead of adding a duplicate row
    const updated = await prisma.address.update({
      where: { id: existingDuplicate.id },
      data: {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        postalCode,
        country,
        addressType: addressType || existingDuplicate.addressType || 'HOME',
        isDefault: makeDefault,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: updated,
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      addressType: addressType || 'HOME',
      isDefault: makeDefault,
    },
  });

  res.status(201).json({
    status: 'success',
    data: address,
  });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req.params.id as string;
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    postalCode,
    country,
    addressType,
    isDefault,
  } = req.body;

  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });

  if (!existingAddress) {
    throw new ApiError(404, 'Address not found');
  }

  if (existingAddress.userId !== userId) {
    throw new ApiError(403, 'Not authorized to update this address');
  }

  // If marking as default, unset other defaults
  if (isDefault && !existingAddress.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault: isDefault !== undefined ? !!isDefault : existingAddress.isDefault,
    },
  });

  res.status(200).json({
    status: 'success',
    data: updated,
  });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req.params.id as string;

  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });

  if (!existingAddress) {
    throw new ApiError(404, 'Address not found');
  }

  if (existingAddress.userId !== userId) {
    throw new ApiError(403, 'Not authorized to delete this address');
  }

  await prisma.address.delete({
    where: { id },
  });

  // If we deleted the default address, make the most recent address default
  if (existingAddress.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully',
  });
});

export const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req.params.id as string;

  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });

  if (!existingAddress) {
    throw new ApiError(404, 'Address not found');
  }

  if (existingAddress.userId !== userId) {
    throw new ApiError(403, 'Not authorized to update this address');
  }

  // Set all user's addresses default to false
  await prisma.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  // Set selected address default to true
  const updated = await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  res.status(200).json({
    status: 'success',
    data: updated,
  });
});
