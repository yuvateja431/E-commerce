import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';

const prisma = new PrismaClient();

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  });
  res.status(200).json({
    status: 'success',
    data: addresses,
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

  // Check if this is the first address, if so, make it default automatically
  const count = await prisma.address.count({ where: { userId } });
  const makeDefault = count === 0 ? true : !!isDefault;

  // If this address is default, unset any previous defaults
  if (makeDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
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
